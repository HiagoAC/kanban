import apiClient, { BASE_URL } from "../../services/apiClient";
import type { GuestAction, User } from "./types";

const ME_URL = "me/";
const CSRF_URL = "csrf/";
const GOOGLE_LOGIN_URL = `${BASE_URL}social-auth/login/google-oauth2/`;
const LOGOUT_URL = "logout/";
const GUEST_ACTION_URL = "session/guest-action/";

export async function getMe(): Promise<User> {
	const res = await apiClient.get(ME_URL);
	return res.data;
}

export async function getCSRFToken(): Promise<void> {
	await apiClient.get(CSRF_URL);
}

export async function signInWithGoogle(guestAction?: GuestAction) {
	if (guestAction) {
		try {
			const user = await getMe();
			if (user.isGuest) {
				await setGuestActionSessionOnSignIn({ guestAction });
			}
		} catch (error) {
			console.error("Failed to set guest action:", error);
		}
	}

	window.location.assign(GOOGLE_LOGIN_URL);
}

export async function logout(): Promise<void> {
	await apiClient.post(LOGOUT_URL);
}

export async function setGuestActionSessionOnSignIn({
	guestAction,
}: {
	guestAction: GuestAction;
}): Promise<void> {
	await apiClient.post(GUEST_ACTION_URL, { guest_action: guestAction });
}
