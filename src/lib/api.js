const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://be1space-production.up.railway.app";

console.log("API_BASE_URL =", API_BASE_URL);

async function handleResponse(response) {
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data?.detail || data?.message || `Request failed with status ${response.status}`
        );
    }

    return data;
}

export async function apiGet(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        cache: "no-store",
    });
    return handleResponse(response);
}

export async function apiPost(endpoint, body) {
    console.log("API_BASE_URL =", API_BASE_URL);
    console.log("endpoint =", endpoint);
    console.log("full URL =", `${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return handleResponse(response);
}

export async function apiDelete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
    });

    return handleResponse(response);
}