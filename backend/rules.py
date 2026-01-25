def generate_explanations(grammar_errors, style_features):
    explanations = []

    if len(grammar_errors) > 3:
        explanations.append(
            "Multiple grammatical issues were detected, which may affect clarity."
        )

    if style_features["avg_sentence_length"] > 25:
        explanations.append(
            "Sentences are long and complex, reducing readability."
        )

    if style_features["passive_ratio"] > 0.4:
        explanations.append(
            "Frequent use of passive voice makes the text sound formal and mechanical."
        )

    return explanations
