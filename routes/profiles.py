from fastapi import APIRouter, HTTPException
from database import supabase

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/")
def get_profiles():
    response = supabase.table("Profiles").select("*").execute()
    return response.data


@router.get("/{profile_id}")
def get_profile(profile_id: str):
    response = supabase.table("Profiles").select("*").eq("id", profile_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return response.data[0]
