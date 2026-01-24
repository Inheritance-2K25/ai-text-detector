from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import TextRequest
from inference import predict_long_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(request: TextRequest):
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
        raise HTTPException(status_code=500, detail=str(e))
