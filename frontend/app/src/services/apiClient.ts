import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const apiClient = axios.create({
	baseURL: "http://localhost:8000/api/",
	headers: { "Content-Type": "application/json" },
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
