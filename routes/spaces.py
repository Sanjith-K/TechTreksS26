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
):
    query = supabase.table("Spaces").select("*")
    if nyu_discount is not None:
        query = query.eq("nyu_discount", nyu_discount)
    if wifi is not None:
        query = query.eq("wifi", wifi)
    if noise_level:
        query = query.eq("noise_level", noise_level)
    if laptop_friendly is not None:
        query = query.eq("laptop_friendly", laptop_friendly)
    response = query.execute()
    return response.data


@router.get("/{space_id}")
def get_space(space_id: str):
    response = supabase.table("Spaces").select("*").eq("google_place_id", space_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Space not found")
    return response.data[0]
