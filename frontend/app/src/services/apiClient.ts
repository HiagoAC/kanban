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
			const parsed = JSON.parse(data);

			return camelcaseKeys(parsed, { deep: true });
		},
	],
});

export default apiClient;
