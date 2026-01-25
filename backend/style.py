import spacy
import numpy as np

nlp = spacy.load("en_core_web_sm")

def analyze_style(text):
    doc = nlp(text)
    sentences = list(doc.sents)

    sentence_lengths = [len(sent) for sent in sentences]
    avg_len = np.mean(sentence_lengths)

    passive_count = sum(
        1 for sent in sentences
        if any(tok.dep_ == "auxpass" for tok in sent)
    )

    passive_ratio = passive_count / len(sentences) if sentences else 0

    return {
        "avg_sentence_length": avg_len,
        "passive_ratio": passive_ratio,
        "num_sentences": len(sentences)
    }
