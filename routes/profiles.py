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


@router.post("/")
def upsert_profile(body: dict):
    """Create or update a profile. Called from the frontend when a profile is missing."""
    user_id = body.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="id is required")
    try:
        response = supabase.table("Profiles").upsert(
            {
                "id": user_id,
                "username": body.get("username", ""),
                "email": body.get("email", ""),
            },
            on_conflict="id"
        ).execute()
        return response.data[0] if response.data else {"id": user_id}
    except Exception as e:
        print(f"Profile upsert failed for {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/favorites")
def get_favorites(user_id: str):
    # Get user's favorites
    fav_res = supabase.table("favorites") \
        .select("*, Spaces(*)") \
        .eq("user_id", user_id) \
        .execute()

    favorites = fav_res.data or []

    # Get ALL favorites to compute counts
    all_favs = supabase.table("favorites").select("space_id").execute()

    counts = {}
    for row in (all_favs.data or []):
        sid = row["space_id"]
        counts[sid] = counts.get(sid, 0) + 1

    # Attach favorite_count to each space
    for fav in favorites:
        space = fav.get("Spaces")
        if space:
            sid = space.get("google_place_id")
            space["favorite_count"] = counts.get(sid, 0)

    return favorites

@router.post("/{user_id}/favorites")
def add_favorite(user_id: str, body: dict):
    space_id = unquote(body["space_id"])
    try:
        response = supabase.table("favorites") \
            .insert({"user_id": user_id, "space_id": space_id}) \
            .execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Could not add favorite")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        if "23505" in str(e):
            return {"message": "already favorited"}
        print(f"Add favorite error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{user_id}/favorites/{space_id}")
def remove_favorite(user_id: str, space_id: str):
    try:
        supabase.table("favorites") \
            .delete() \
            .eq("user_id", user_id) \
            .eq("space_id", space_id) \
            .execute()
        return {"message": "Favorite removed"}
    except Exception as e:
        print(f"Remove favorite error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
