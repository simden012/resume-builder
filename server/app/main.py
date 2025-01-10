from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
# from app.routers import resume
from llamaapi import LlamaAPI
import json
import os

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_token = os.getenv("LLAMA_API_KEY")

llama = LlamaAPI(api_token)
class DescriptionRequest(BaseModel):
    description: str


@app.get("/")
def read_root():
    return {"message" : "welcome time to start the grind bitch"}

@app.post("/ai-suggestions")
def ai_suggestions(data: DescriptionRequest):
    description = data.description
    try:
        api_request_json = {
        "model": "llama3.1-70b",
        "messages": [
            {"role": "system", "content": "You are a resume assistant."},
            {"role": "user", "content": f"Improve this job description for a resume: {description}"},
        ]
        }

        response = llama.run(api_request_json)
        response_json = response.json()
        suggestion = response_json["choices"][0]["message"]["content"].strip()

        return {"suggestion": suggestion}
    except Exception as e:
        return {"error": str(e)}