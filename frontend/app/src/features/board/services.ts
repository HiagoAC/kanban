import apiClient from "../../services/apiClient";

const BOARD_URL = "boards/";

export const fetchBoards = async () => {
	const response = await apiClient.get(BOARD_URL);
	return response.data;
};
