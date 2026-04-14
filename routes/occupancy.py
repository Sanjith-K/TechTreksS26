from fastapi import APIRouter, HTTPException
from database import supabase
from models.schemas import OccupancyVote

router = APIRouter(prefix="/occupancy", tags=["occupancy"])

@router.post("/vote")
def submit_vote(vote: OccupancyVote):
    if vote.vote not in ["quiet", "moderate", "busy"]:
        raise HTTPException(status_code=400, detail="Vote must be 'quiet', 'moderate', or 'busy'")

    response = supabase.table("occupancy_votes").insert({
        "space_id": vote.space_id,
        "vote": vote.vote
    }).execute()

    return {"message": "Vote submitted", "data": response.data}


@router.get("/{space_id}")
def get_occupancy(space_id: str):
    response = supabase.table("live_occupancy").select("*").eq("space_id", space_id).execute()

    if not response.data:
        return {"space_id": space_id, "current_status": "unknown", "total_votes": 0}

    return response.data[0]