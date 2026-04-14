import { apiGet } from "./api";

export async function getProfile(profileId) {
    return apiGet(`/profiles/${profileId}`);
}