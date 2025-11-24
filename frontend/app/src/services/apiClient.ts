import axios from "axios";
import camelcaseKeys from "camelcase-keys";

const BASE_URL = "http://localhost:8000/api/";

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	transformResponse: [
		(data) => {
			if (!data || data === "") {
				return null;
			}
			try {
				const parsed = JSON.parse(data);
				return camelcaseKeys(parsed, { deep: true });
			} catch (error) {
				console.error("Error parsing response data:", error);
				return data;
			}
		},
	],
});

export default apiClient;
