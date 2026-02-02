from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Schemas
from schemas import TextRequest

# AI inference
# from inference import predict_long_text  #Old Model
from hybrid.hybrid_predictor import predict_long_text


# Grammar + style
from grammar import check_grammar
from style import analyze_style
from rules import generate_explanations

import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Text Analysis API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Health check
# -----------------------
@app.get("/")
def read_root():
    return {"status": "API is running"}

# -----------------------
# AI Detection Endpoint
# -----------------------
@app.post("/predict")
async def predict(request: TextRequest):
    text = request.text.strip()

    if len(text) < 40:
        raise HTTPException(
            status_code=400,
            detail="Text too short to analyze"
        )

    try:
        result = predict_long_text(text)
        return result
    except Exception as e:
        logging.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Prediction service failed"
        )

# -----------------------
# Grammar + Style Analysis
# -----------------------
@app.post("/analyze")
async def analyze(request: TextRequest):
    text = request.text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Text is required"
        )

    try:
        grammar_errors = check_grammar(text)
        style_features = analyze_style(text)
        explanations = generate_explanations(
            grammar_errors,
            style_features
        )

        return {
            "grammar_errors": grammar_errors,
            "style_features": style_features,
            "explanations": explanations
        }

    except Exception as e:
        logging.exception("Analysis failed")
        raise HTTPException(
            status_code=500,
            detail="Text analysis failed"
        )
