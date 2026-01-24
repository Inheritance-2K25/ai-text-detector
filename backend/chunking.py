def chunk_text(text, chunk_size=800, min_chunk_size=40):
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]

        if len(chunk.strip()) >= min_chunk_size:
            chunks.append(chunk)

        start = end

    return chunks
