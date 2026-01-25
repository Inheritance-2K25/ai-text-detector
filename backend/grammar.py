import language_tool_python

tool = language_tool_python.LanguageTool('en-US')

def check_grammar(text):
    matches = tool.check(text)
    errors = []

    for m in matches:
        errors.append({
            "message": m.message,
            "suggestions": m.replacements,
            "offset": m.offset,
            "length": m.error_length
        })

    return errors
