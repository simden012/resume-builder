from fastapi import APIRouter, HTTPException 

router = APIRouter(prefix="/users",
                   tags=["Users"])
