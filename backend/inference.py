import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from chunking import chunk_text

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

MODEL_PATH = "./model"  # update if needed

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.to(DEVICE)
model.eval()


def predict_chunk(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(DEVICE)

    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)

    ai_prob = probs[0][1].item()
    human_prob = probs[0][0].item()

    label = "AI" if ai_prob >= 0.5 else "Human"

    return ai_prob, human_prob


def predict_long_text(text):
    chunks = chunk_text(text)

    if not chunks:
        raise ValueError("Text too short to analyze")

    ai_probs = []

    for chunk in chunks:
        ai_prob, _ = predict_chunk(chunk)
        ai_probs.append(ai_prob)

    avg_ai_prob = sum(ai_probs) / len(ai_probs)

    final_label = "AI" if avg_ai_prob >= 0.5 else "Human"

    return {
        "label": final_label,
        "confidence": avg_ai_prob if final_label == "AI" else 1 - avg_ai_prob,
        "chunks_analyzed": len(chunks)
    }


