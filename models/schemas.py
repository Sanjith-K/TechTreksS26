from pydantic import BaseModel
from typing import Optional

class Space(BaseModel):
    google_place_id: str
    name: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    price_range: Optional[int]
    nyu_discount: Optional[bool]
    wifi: Optional[bool]
    bathroom: Optional[bool]
    noise_level: Optional[str]
    laptop_friendly: Optional[bool]
    tags: Optional[str]
    vibe: Optional[str]
    nyu_id_required: Optional[bool]

class OccupancyVote(BaseModel):
    space_id: str
    vote: str

class OccupancyStatus(BaseModel):
    space_id: str
    current_status: str
    total_votes: int