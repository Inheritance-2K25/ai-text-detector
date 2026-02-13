import torch
import joblib
import numpy as np
from transformers import AutoTokenizer, AutoModel
from chunking import chunk_text
from .stylometry import extract_stylometric_features

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

MODEL_PATH = "Yash9911/Ai-Text-Detector"
HYBRID_MODEL_PATH = "./hybrid/hybrid_classifier.pkl"

# Load models
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
deberta = AutoModel.from_pretrained(MODEL_PATH).to(DEVICE)
deberta.eval()

hybrid_clf = joblib.load(HYBRID_MODEL_PATH)


def get_deberta_embedding(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(DEVICE)

    with torch.no_grad():
        outputs = deberta(**inputs)

    # Mean pooling over tokens
    embedding = outputs.last_hidden_state.mean(dim=1)
    return embedding.cpu().numpy()[0]


def get_hybrid_features(text):
    semantic = get_deberta_embedding(text)
    stylistic = extract_stylometric_features(text)
    return np.concatenate([semantic, stylistic])


def predict_chunk(text):
    features = get_hybrid_features(text).reshape(1, -1)
    ai_prob = hybrid_clf.predict_proba(features)[0][1]
    return ai_prob


def predict_long_text(text):
    chunks = chunk_text(text)

    if not chunks:
        raise ValueError("Text too short to analyze")

    ai_probs = [predict_chunk(chunk) for chunk in chunks]
    avg_ai_prob = sum(ai_probs) / len(ai_probs)

    label = "AI" if avg_ai_prob >= 0.5 else "Human"

    return {
        "label": label,
        "confidence": avg_ai_prob if label == "AI" else 1 - avg_ai_prob,
        "chunks_analyzed": len(chunks)
    }
