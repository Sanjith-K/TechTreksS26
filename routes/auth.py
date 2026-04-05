from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
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
        print(f"Signup response: user={response.user}, session={response.session}")

    except Exception as e:
        print(f"Signup error type: {type(e).__name__}, detail: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    if not response.user:
        raise HTTPException(status_code=400, detail="Signup failed.")

    try:
        supabase.table("Profiles").insert({
            "id": response.user.id,
            "username": data.name,
            "email": data.email,
        }).execute()
    except Exception:
        pass

    return {"message": "Account created successfully."}


@router.post("/login")
def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    if not response.user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    profile = supabase.table("Profiles").select("*").eq("email", response.user.email).execute()
    name = profile.data[0].get("username") if profile.data else response.user.user_metadata.get("name", "")

    return {
        "user": {
            "id": response.user.id,
            "email": response.user.email,
            "name": name,
        }
    }
