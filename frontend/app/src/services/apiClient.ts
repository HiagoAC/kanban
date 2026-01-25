import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { getCookie } from "../utils/cookies";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
	baseURL: `${BASE_URL}api/`,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
	xsrfCookieName: "csrftoken",
	xsrfHeaderName: "X-CSRFToken",
});

apiClient.interceptors.request.use((config) => {
	const contentType = String(config.headers["Content-Type"] || "");

	if (config.data && contentType.includes("application/json")) {
		config.data = snakecaseKeys(config.data, { deep: true });
	}

	const csrfToken = getCookie("csrftoken");
	if (csrfToken) {
		config.headers["X-CSRFToken"] = csrfToken;
	}

	return config;
});

apiClient.interceptors.response.use((response) => {
	if (response.data) {
		response.data = camelcaseKeys(response.data, { deep: true });
	}
	return response;
});

export default apiClient;
