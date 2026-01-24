from fastapi import FastAPI
from pydantic import BaseModel
from inference import predict

app = FastAPI()

class TextRequest(BaseModel):
    text: str

@app.get("/")
def health_check():
    return {"status": "Backend running"}

@app.post("/predict")
def predict_text(req: TextRequest):
    return predict(req.text)
