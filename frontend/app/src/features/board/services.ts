import apiClient from "../../services/apiClient";

const BOARD_URL = "boards/";

interface CreateBoardPayload {
	title: string;
	columns: string[];
}


export const fetchBoards = async () => {
	const res = await apiClient.get(BOARD_URL);
	return res.data;
};

export const createBoard = async (boardData: CreateBoardPayload) => {
	const res = await apiClient.post(BOARD_URL, boardData);
	return res.data;
};
