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
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    if not response.user:
        raise HTTPException(status_code=400, detail="Signup failed.")

    try:
        supabase.table("Profiles").insert({
            "id": response.user.id,
            "username": data.name,
            "email": data.email,
        }).execute()
    except Exception as e:
        print(f"Profile creation error during signup: {e}")

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

    if not profile.data:
        # Profile missing (e.g. signup profile insert failed) — create it now
        name = response.user.user_metadata.get("name", data.email.split("@")[0])
        try:
            supabase.table("Profiles").insert({
                "id": response.user.id,
                "username": name,
                "email": data.email,
            }).execute()
        except Exception as e:
            print(f"Profile auto-create on login failed: {e}")
    else:
        name = profile.data[0].get("username", "")

    return {
        "user": {
            "id": response.user.id,
            "email": response.user.email,
            "name": name,
        }
    }
