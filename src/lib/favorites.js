import { apiGet, apiPost, apiDelete } from "./api";

export async function getFavorites(userId) {
    return apiGet(`/profiles/${userId}/favorites`);
}

export async function addFavorite(userId, spaceId) {
    return apiPost(`/profiles/${userId}/favorites`, {
        space_id: spaceId,
    });
}

export async function removeFavorite(userId, spaceId) {
    return apiDelete(`/profiles/${userId}/favorites/${spaceId}`);
}