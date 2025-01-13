from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from spire.doc import Document, FileFormat, DocPicture
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

def replace_placeholders(document, replacements):
    """
    Replaces placeholders in the document with corresponding values.
    :param document: The Spire.Doc document object.
    :param replacements: A dictionary of placeholders and their replacements.
    """
    for placeholder, value in replacements.items():
        document.Replace(placeholder, value, False, True)

def add_work_experiences(document, placeholder, experiences):
    """
    Replaces a placeholder with multiple work experiences.
    :param document: The Spire.Doc document object.
    :param placeholder: Placeholder to replace (e.g., "{WorkExperience}").
    :param experiences: List of work experiences.
    """
    selections = document.FindAllString(placeholder, True, True)
    if not selections:
        print(f"Placeholder {placeholder} not found!")
        return

    experience_text = ""
    for exp in experiences:
        experience_text += (
            f"{exp['company']}, {exp['location']} — {exp['jobTitle']}\n"
            f"{exp['duration']}\n"
            f"{exp['description']}\n\n"
        )

    for selection in selections:
        selection.GetAsOneRange().Text = experience_text.strip()
def add_educations(document, placeholder, educations):
    """
    Replaces a placeholder with multiple education entries.
    :param document: The Spire.Doc document object.
    :param placeholder: Placeholder to replace (e.g., "{Education}").
    :param educations: List of education entries.
    """
    selections = document.FindAllString(placeholder, True, True)
    if not selections:
        print(f"Placeholder {placeholder} not found!")
        return

    education_text = ""
    for edu in educations:
        education_text += (
            f"{edu['institution']}, {edu.get('location', 'Location')} — {edu['degree']}\n"
            f"{edu['year']}\n\n"
        )

    for selection in selections:
        selection.GetAsOneRange().Text = education_text.strip()
def add_projects(document, placeholder, projects):
    """
    Replaces a placeholder with multiple project entries.
    :param document: The Spire.Doc document object.
    :param placeholder: Placeholder to replace (e.g., "{Project Name}").
    :param projects: List of project entries.
    """
    selections = document.FindAllString(placeholder, True, True)
    if not selections:
        print(f"Placeholder {placeholder} not found!")
        return

    projects_text = ""
    for proj in projects:
        projects_text += (
            f"{proj['name']} — Details\n"
            f"{proj['description']}\n\n"
        )

    for selection in selections:
        selection.GetAsOneRange().Text = projects_text.strip()
def add_skills(document, placeholder, skills):
    """
    Replaces a placeholder with a newline-separated list of skills.
    :param document: The Spire.Doc document object.
    :param placeholder: Placeholder to replace (e.g., "{Skill}").
    :param skills: List of skills.
    """
    selections = document.FindAllString(placeholder, True, True)
    if not selections:
        print(f"Placeholder {placeholder} not found!")
        return

    skills_text = "\n".join(f"- {skill}" for skill in skills)

    for selection in selections:
        selection.GetAsOneRange().Text = skills_text.strip()
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
    template_path = f"./app/templates/docx/{template_name}.docx"
    print(f"tPath: {template_path}")
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")

    document = Document()
    document.LoadFromFile(template_path)

    personal_replacements = {
        "{Your Name}": personal_info["fullName"],
        "{Your Email}": personal_info["email"],
        "{Your Phone}": personal_info["phone"],
    }
    replace_placeholders(document, personal_replacements)

    add_work_experiences(document, "{WorkExperience}", work_experiences)

    add_educations(document, "{Education}", educations)

    add_projects(document, "{Project}", projects)

    add_skills(document, "{Skill}", skills)


    file_id = str(uuid.uuid4())
    output_path = f"{GENERATED_RESUME_DIR}/{file_id}.docx"
    document.SaveToFile(output_path, FileFormat.Docx2016)
    document.Close()

    return {"download_url": f"http://127.0.0.1:8000/download/{file_id}"}

@app.get("/download/{file_id}")
def download_resume(file_id: str):
    file_path = f"{GENERATED_RESUME_DIR}/{file_id}.docx"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="resume.docx",
    )