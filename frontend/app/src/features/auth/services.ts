import apiClient, { BASE_URL } from "../../services/apiClient";
import type { User } from "./types";

const ME_URL = "me/";
const CSRF_URL = "csrf/";
const GOOGLE_LOGIN_URL = `${BASE_URL}social-auth/login/google-oauth2/`;
const LOGOUT_URL = "logout/";

export async function getMe(): Promise<User> {
	const res = await apiClient.get(ME_URL);
	return res.data;
}

export async function getCSRFToken(): Promise<void> {
	await apiClient.get(CSRF_URL);
}

export function signInWithGoogle() {
	window.location.assign(GOOGLE_LOGIN_URL);
}

export async function logout(): Promise<void> {
	await apiClient.post(LOGOUT_URL);
}
