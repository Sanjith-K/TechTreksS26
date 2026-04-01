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
        response = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True,
            "user_metadata": {"name": data.name},
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not response.user:
        raise HTTPException(status_code=400, detail="Signup failed.")

    try:
        supabase.table("Profiles").insert({
            "id": response.user.id,
            "name": data.name,
            "email": data.email,
        }).execute()
    except Exception:
        pass

    return {"message": "Account created successfully."}
