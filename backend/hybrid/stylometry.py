import re
import numpy as np

STOPWORDS = {
    "the","is","in","and","to","of","a","that","it","on","for","as",
    "with","was","were","be","by","this","are","from","or","at"
}

def extract_stylometric_features(text):
    if not text or len(text.strip()) == 0:
        return np.zeros(8)

    words = re.findall(r"\b\w+\b", text)

    # simple & reliable sentence split (NO NLTK)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s for s in sentences if len(s.strip()) > 0]

    avg_word_len = sum(len(w) for w in words) / len(words)
    avg_sent_len = len(words) / max(len(sentences), 1)
    vocab_richness = len(set(words)) / len(words)

    punctuation_ratio = sum(1 for c in text if c in ".,;!?") / len(text)
    uppercase_ratio = sum(1 for c in text if c.isupper()) / len(text)
    digit_ratio = sum(1 for c in text if c.isdigit()) / len(text)
    whitespace_ratio = sum(1 for c in text if c.isspace()) / len(text)

    stopword_ratio = sum(w.lower() in STOPWORDS for w in words) / len(words)

    return np.array([
        avg_word_len,
        avg_sent_len,
        vocab_richness,
        punctuation_ratio,
        uppercase_ratio,
        digit_ratio,
        whitespace_ratio,
        stopword_ratio
    ])
