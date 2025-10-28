import apiClient from "../../services/apiClient";
import type { Board, BoardListItem } from "./types";

const BOARD_URL = "boards/";

interface CreateBoardPayload {
	title: string;
	columns: string[];
}

export const fetchBoards = async (): Promise<BoardListItem[]> => {
	const res = await apiClient.get(BOARD_URL);
	return res.data;
};

export const createBoard = async (
	boardData: CreateBoardPayload,
): Promise<Board> => {
	const res = await apiClient.post(BOARD_URL, boardData);
	return res.data;
};
