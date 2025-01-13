from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from docx import Document
from dotenv import load_dotenv
# from app.routers import resume
from llamaapi import LlamaAPI
import uuid
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
GENERATED_RESUME_DIR = "./app/generated_resumes"
os.makedirs(GENERATED_RESUME_DIR, exist_ok=True)
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
    
@app.post("/generate-resume")
async def generate_resume(request: Request):
    data = await request.json()
    personal_info = data["personalInfo"]
    work_experiences = data["workExperiences"]
    educations = data["educations"]
    skills = data["skills"]
    projects = data["projects"]
    template_name = data["selectedTemplate"]
    # Load the template
    template_path = f"./app/templates/docx/{template_name}.docx"
    print(f"tPath: {template_path}")
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")

    doc = Document(template_path)

    for paragraph in doc.paragraphs:
        paragraph.text = paragraph.text.replace("{Your Name}", personal_info["fullName"])
        paragraph.text = paragraph.text.replace("{Your Email}", personal_info["email"])
        paragraph.text = paragraph.text.replace("{Your Phone}", personal_info["phone"])
    
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if "{Company}" in cell.text:
                    cell.text = ""
                    for exp in work_experiences:
                        cell.add_paragraph(
                            f"{exp['company']}, {exp['location']} — {exp['jobTitle']}\n"
                            f"{exp['duration']}\n"
                            f"{exp['description']}"
                        )

                if "{Institution}" in cell.text:
                    cell.text = ""
                    for edu in educations:
                        cell.add_paragraph(
                            f"{edu['institution']}, Location — {edu['degree']}\n"
                            f"{edu['year']}"
                        )

                if "{Project Name}" in cell.text:
                    cell.text = ""
                    for proj in projects:
                        cell.add_paragraph(
                            f"{proj['name']} — Details\n"
                            f"{proj['description']}"
                        )

    for paragraph in doc.paragraphs:
        if "{Skill}" in paragraph.text:
            paragraph.text = ""
            for skill in skills:
                paragraph.add_run(f"- {skill}\n")

    file_id = str(uuid.uuid4())
    output_path = f"{GENERATED_RESUME_DIR}/{file_id}.docx"
    doc.save(output_path)

    return {"download_url": f"http://127.0.0.1:8000/download/{file_id}"}