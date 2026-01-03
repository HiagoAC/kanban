import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export const BASE_URL = "http://localhost:8000/";

const apiClient = axios.create({
	baseURL: `${BASE_URL}api/`,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

// --- Request: camelCase → snake_case ---
apiClient.interceptors.request.use((config) => {
	const contentType = String(config.headers["Content-Type"] || "");

	if (config.data && contentType.includes("application/json")) {
		config.data = snakecaseKeys(config.data, { deep: true });
	}

	return config;
});

// --- Response: snake_case → camelCase ---
apiClient.interceptors.response.use((response) => {
	if (response.data) {
		response.data = camelcaseKeys(response.data, { deep: true });
	}
	return response;
});

export default apiClient;
