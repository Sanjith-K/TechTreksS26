import { apiGet } from "./api";

export async function getSpaces(filters = {}) {
    const params = new URLSearchParams();

    if (filters.nyu_discount !== undefined) {
        params.append("nyu_discount", filters.nyu_discount);
    }

    if (filters.wifi !== undefined) {
        params.append("wifi", filters.wifi);
    }

    if (filters.noise_level) {
        params.append("noise_level", filters.noise_level);
    }

    if (filters.laptop_friendly !== undefined) {
        params.append("laptop_friendly", filters.laptop_friendly);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/spaces/?${queryString}` : "/spaces/";

    return apiGet(endpoint);
}

export async function getSpaceById(spaceId) {
    return apiGet(`/spaces/${spaceId}`);
}