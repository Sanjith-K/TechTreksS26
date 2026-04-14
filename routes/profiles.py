from urllib.parse import unquote

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

@router.get("/{user_id}/favorites")
def get_favorites(user_id: str):
    response = supabase.table("favorites") \
        .select("*, Spaces(*)") \
        .eq("user_id", user_id) \
        .execute()
    return response.data

@router.post("/{user_id}/favorites")
def add_favorite(user_id: str, body: dict):
    space_id = unquote(body["space_id"])
    try:
        response = supabase.table("favorites") \
            .insert({"user_id": user_id, "space_id": space_id}) \
            .execute()
    except Exception as e:
        if "23505" in str(e):
            return {"message": "already favorited"}
        raise
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not add favorite")
    return response.data[0]

@router.delete("/{user_id}/favorites/{space_id}")
def remove_favorite(user_id: str, space_id: str):
    response = supabase.table("favorites") \
        .delete() \
        .eq("user_id", user_id) \
        .eq("space_id", space_id) \
        .execute()
    return {"message": "Favorite removed"}