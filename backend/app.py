from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Schemas
from schemas import TextRequest

# AI inference
from inference import predict_long_text

# Grammar + style
from grammar import check_grammar
from style import analyze_style
from rules import generate_explanations

import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Text Analysis API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your Live Server (5500) to talk to Uvicorn (8000)
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], # Explicitly allow OPTIONS
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



import re  # MUST HAVE THIS
import logging
from pydantic import BaseModel
import httpx
import asyncio


class TextRequest(BaseModel):
    text: str

# 1. Define helper functions FIRST
def clean_text(text: str) -> str:
    # Removes hidden control characters
    return re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)



# --- Configuration for Winston AI ---
WINSTON_API_KEY = "API_KEY_HERE"
WINSTON_URL = "https://api.gowinston.ai/v2/plagiarism"

@app.post("/plagiarism")
async def check_plagiarism_endpoint(request: TextRequest):
    # 1. Clean the text (Reuse your existing clean_text function)
    text = clean_text(request.text.strip())

    # 2. Winston AI requires at least 100 characters
    if len(text) < 100:
        raise HTTPException(
            status_code=400,
            detail="Winston AI requires at least 100 characters for a scan."
        )

    # 3. Setup Headers (Bearer Token)
    headers = {
        "Authorization": f"Bearer {WINSTON_API_KEY}",
        "Content-Type": "application/json"
    }

    # 4. Setup Body
    payload = {
        "text": text,
        "language": "en", # or "auto"
        "country": "us"
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            logging.info("Sending request to Winston AI...")
            response = await client.post(WINSTON_URL, json=payload, headers=headers)

            # Handle common errors (Credits, Auth, etc.)
            if response.status_code == 401:
                raise HTTPException(status_code=401, detail="Invalid Winston API Token")
            elif response.status_code == 402 or response.status_code == 429:
                raise HTTPException(status_code=402, detail="Out of Winston AI credits")
            elif response.status_code != 200:
                logging.error(f"Winston Error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Winston AI service error")

            # Success! Return the full JSON directly
            return response.json()

        except httpx.ReadTimeout:
            raise HTTPException(status_code=504, detail="Winston AI took too long to respond")
        except Exception as e:
            logging.exception("Winston Plagiarism check failed")
            raise HTTPException(status_code=500, detail=str(e))