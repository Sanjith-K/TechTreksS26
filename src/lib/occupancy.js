import { apiGet, apiPost } from "./api";

export async function getOccupancy(spaceId) {
    return apiGet(`/occupancy/${spaceId}`);
}

export async function submitOccupancyVote(spaceId, vote) {
    return apiPost("/occupancy/vote", {
        space_id: spaceId,
        vote,
    });
}