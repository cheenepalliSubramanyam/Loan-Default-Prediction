from fastapi import FastAPI
from schema import LoanRequest
import xgboost as xgb
import pandas as pd
from preprocess import preprocess
from features import MODEL_FEATURES
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum   # NEW

app = FastAPI(root_path="/default")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = xgb.XGBClassifier()
model.load_model('model/loan_default_model.json')

@app.get("/")
def home():
    return {"message": "Loan Default Prediction API"}

@app.post("/predict")
def predict(data: LoanRequest):

    df = pd.DataFrame([data.dict()])

    df = preprocess(df)

    df = df[MODEL_FEATURES]

    prob = float(model.predict_proba(df)[0][1])

    risk_percent = round(prob * 100, 2)

    if risk_percent < 20:
        risk_level = "LOW"
    elif risk_percent < 50:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {
        "default_risk_percent": risk_percent,
        "risk_level": risk_level
    }

# IMPORTANT FOR LAMBDA
handler = Mangum(app)