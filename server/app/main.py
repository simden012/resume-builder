from fastapi import FastAPI
from app.routers import resume

app = FastAPI()

app.include_router(resume.router)

@app.get("/")
def read_root():
    return {"message" : "welcome time to start the grind bitch"}