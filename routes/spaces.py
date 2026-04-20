from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from database import supabase

router = APIRouter(prefix="/spaces", tags=["Spaces"])


def get_favorite_counts():
    fav_res = supabase.table("favorites").select("space_id").execute()
    counts = {}
    for row in (fav_res.data or []):
        sid = row["space_id"]
        counts[sid] = counts.get(sid, 0) + 1
    return counts


@router.get("/")
def get_spaces(
    nyu_discount: Optional[bool] = Query(default=None),
    wifi: Optional[bool] = Query(default=None),
    noise_level: Optional[str] = Query(default=None),
    laptop_friendly: Optional[bool] = Query(default=None),
    price_range: Optional[int] = Query(default=None),
):
    query = supabase.table("Spaces").select("*")
    if nyu_discount is not None:
        query = query.eq("nyu_discount", nyu_discount)
    if wifi is not None:
        query = query.eq("wifi", wifi)
    if noise_level:
        query = query.eq("noise_level", noise_level.lower())
    if laptop_friendly is not None:
        query = query.eq("laptop_friendly", laptop_friendly)
    if price_range is not None:
        query = query.eq("price_range", price_range)

    response = query.execute()
    spaces = response.data or []

    counts = get_favorite_counts()
    for space in spaces:
        space["favorite_count"] = counts.get(space["google_place_id"], 0)

    return spaces


@router.get("/popular")
def get_popular_spaces(limit: int = 10):
    counts = get_favorite_counts()

    if not counts:
        return []

    top_ids = sorted(counts, key=lambda k: counts[k], reverse=True)[:limit]

    spaces_res = supabase.table("Spaces").select("*").in_("google_place_id", top_ids).execute()
    spaces = spaces_res.data or []

    for space in spaces:
        space["favorite_count"] = counts.get(space["google_place_id"], 0)

    spaces.sort(key=lambda s: s["favorite_count"], reverse=True)
    return spaces


@router.get("/{space_id}")
def get_space(space_id: str):
    response = supabase.table("Spaces").select("*").eq("google_place_id", space_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Space not found")

    space = response.data[0]
    counts = get_favorite_counts()
    space["favorite_count"] = counts.get(space["google_place_id"], 0)
    return space