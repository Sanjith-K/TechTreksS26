import { apiPost } from "./api";

export async function signup({ name, email, password }) {
    return apiPost("/auth/signup", { name, email, password });
}

export async function login({ email, password }) {
    return apiPost("/auth/login", { email, password });
}