import apiClient, { BASE_URL } from "../../services/apiClient";
import type { User } from "./types";

const ME_URL = "me/";

export async function getMe(): Promise<User> {
	const res = await apiClient.get(ME_URL);
	return res.data;
}

export async function getCSRFToken(): Promise<void> {
	await apiClient.get("csrf");
}

export function signInWithGoogle() {
	window.location.assign(`${BASE_URL}social-auth/login/google-oauth2/`);
}
