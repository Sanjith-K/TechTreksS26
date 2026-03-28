from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


@router.post("/signup")
def signup(data: SignupRequest):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {"data": {"name": data.name}},
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if response.user is None:
        raise HTTPException(status_code=400, detail="Signup failed.")

    try:
        supabase.table("Profiles").insert({
            "id": response.user.id,
            "name": data.name,
            "email": data.email,
        }).execute()
    except Exception:
        pass

    return {"message": "Account created. Please check your email to confirm."}
