import { BASE_URL } from "../../services/apiClient";

export function signInWithGoogle() {
	window.location.assign(`${BASE_URL}social-auth/login/google-oauth2/`);
}
