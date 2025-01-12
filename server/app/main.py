from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
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
app.mount("/app/templates", StaticFiles(directory="app/templates"), name="app/templates")

TEMPLATE_DIR = "./app/templates/pdf"

api_token = os.getenv("LLAMA_API_KEY")

llama = LlamaAPI(api_token)
class SuggestionRequest(BaseModel):
    typeOfSuggestion: str ## job or project
    description: str


@app.get("/")
def read_root():
    return {"message" : "welcome to the resume builder api"}

@app.get("/templates")
def get_templates():
    templates = [{"name": os.path.splitext(f)[0], "path": f"/app/templates"} for f in os.listdir(TEMPLATE_DIR)]
    return {"templates": templates}

@app.get("/template-preview/{filename}")
def get_template_preview(filename: str):
    filepath = os.path.join(TEMPLATE_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)
    return {"error": "File not found"}

@app.post("/ai-suggestions")
def ai_suggestions(data: SuggestionRequest):
    description = data.description
    typeOfSuggestion = data.typeOfSuggestion
    try:
        api_request_json = {
            "model": "llama3.1-70b",
            "messages": [
                {"role": "system", "content": "You are a resume assistant."},
                {"role": "user", "content": f"""
                    Improve this {typeOfSuggestion} description for a resume: {description}

                    Provide exactly 3 improved suggestions. Format them as follows:
                    1. [First Suggestion]
                    2. [Second Suggestion]
                    3. [Third Suggestion]
                                    """},
                                ]
        }

        response = llama.run(api_request_json)
        response_text = response.json()["choices"][0]["message"]["content"]

        suggestions = response_text.split("\n")
        clean_suggestions = [s.strip() for s in suggestions if s.strip().startswith(("1.", "2.", "3."))]

        return {"suggestions": clean_suggestions}
    except Exception as e:
        return {"error": str(e)}