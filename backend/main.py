from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import io
import os

app = FastAPI(title="SuccessPredict AI API")

# Enable CORS for React communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Auth Database matching your requirement
USERS = {
    "admin": {"password": "admin123", "role": "admin"},
    "teacher": {"password": "teacher123", "role": "teacher"},
    "student": {"password": "student123", "role": "student"},
}

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

def get_strategic_solution(row, is_at_risk):
    if not is_at_risk:
        return "Maintain current habits. Join peer tutoring to excel further."
    
    # Logic based on socioeconomic indicators
    if row['income'] < 15000:
        return "Priority: Endorse for Government Educational Subsidy (SDG 1)."
    if row['absences'] > 15:
        return "Intervention: Conduct home visitation and flexible learning options."
    if row['internet_access'] == 0:
        return "Resource Allocation: Provide offline learning modules or school lab access."
    return "Guidance: Schedule mandatory counseling for academic adjustment."

@app.post("/login")
async def login(req: LoginRequest):
    user = USERS.get(req.username)
    if user and user["password"] == req.password and user["role"] == req.role:
        return {"username": req.username, "role": req.role}
    raise HTTPException(status_code=401, detail="Invalid Credentials")

@app.post("/analyze")
async def analyze_csv(file: UploadFile = File(...)):
    if not os.path.exists("model/student_model.pkl"):
        raise HTTPException(status_code=500, detail="AI Model not trained.")
    
    with open("model/student_model.pkl", "rb") as f:
        model = pickle.load(f)
        
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Ensure required columns exist
    required = ['income', 'absences', 'parent_edu', 'internet_access', 'study_time', 'distance_to_school']
    if not all(col in df.columns for col in required):
        raise HTTPException(status_code=400, detail="CSV missing required socioeconomic columns.")

    predictions = model.predict(df[required])
    probabilities = model.predict_proba(df[required])[:, 1]
    
    results = []
    for i, row in df.iterrows():
        is_at_risk = bool(predictions[i])
        risk_score = float(probabilities[i] * 100)
        
        results.append({
            "name": row.get("name", f"Student {i+1}"),
            "at_risk": is_at_risk,
            "risk_score": round(risk_score, 2),
            "solution": get_strategic_solution(row, is_at_risk)
        })
        
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)