import apiClient from "../../services/apiClient";

const BOARD_URL = "boards/";

export const fetchBoards = async () => {
	const res = await apiClient.get(BOARD_URL);
	return res.data;
};
