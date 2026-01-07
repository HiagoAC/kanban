export function getCookie(name: string): string | null {
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [cookieName, ...cookieValue] = cookie.trim().split("=");
		if (cookieName === name) {
			return cookieValue.join("=");
		}
	}
	return null;
}
