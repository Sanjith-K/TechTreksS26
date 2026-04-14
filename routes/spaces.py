from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from database import supabase

router = APIRouter(prefix="/spaces", tags=["Spaces"])


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
    return response.data


@router.get("/map")
def get_spaces_for_map():
    response = supabase.table("Spaces") \
        .select("google_place_id, name, address, latitude, longitude, noise_level, vibe, price_range, tags") \
        .not_.is_("latitude", "null") \
        .not_.is_("longitude", "null") \
        .execute()
    return response.data


@router.get("/{space_id}")
def get_space(space_id: str):
    response = supabase.table("Spaces").select("*").eq("google_place_id", space_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Space not found")
    return response.data[0]