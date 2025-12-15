import apiClient from "../../services/apiClient";
import type {
	Board,
	BoardListItem,
	UpdateBoardSchema,
	UpdateColumnSchema,
} from "./types";

const BOARD_URL = "boards/";

interface CreateBoardPayload {
	title: string;
	columns: string[];
}

export const fetchBoards = async (): Promise<BoardListItem[]> => {
	const res = await apiClient.get(BOARD_URL);
	const boards = res.data as BoardListItem[];
	boards.forEach((board) => {
		board.updatedAt = new Date(board.updatedAt);
	});
	return boards;
};

export const createBoard = async (
	boardData: CreateBoardPayload,
): Promise<Board> => {
	const res = await apiClient.post(BOARD_URL, boardData);
	return res.data;
};

export const getBoard = async (id: string): Promise<Board> => {
	const res = await apiClient.get(`${BOARD_URL}${id}/`);
	const board = res.data;
	board.createdAt = new Date(board.createdAt);
	board.updatedAt = new Date(board.updatedAt);
	return board;
};

export const updateBoard = async ({
	id,
	boardData,
}: UpdateBoardSchema): Promise<Board> => {
	const res = await apiClient.patch(`${BOARD_URL}${id}/`, boardData);
	const board = res.data;
	board.createdAt = new Date(board.createdAt);
	board.updatedAt = new Date(board.updatedAt);
	return board;
};

export const deleteBoard = async (id: string): Promise<void> => {
	await apiClient.delete(`${BOARD_URL}${id}/`);
};

export const addColumnToBoard = async (
	boardId: string,
	columnTitle: string,
): Promise<Board> => {
	const res = await apiClient.post(`${BOARD_URL}${boardId}/columns/`, {
		title: columnTitle,
	});
	const board = res.data;
	board.createdAt = new Date(board.createdAt);
	board.updatedAt = new Date(board.updatedAt);
	return board;
};

export const updateColumnInBoard = async ({
	boardId,
	columnId,
	columnData,
}: UpdateColumnSchema): Promise<Board> => {
	const res = await apiClient.patch(
		`${BOARD_URL}${boardId}/columns/${columnId}/`,
		columnData,
	);
	const board = res.data;
	board.createdAt = new Date(board.createdAt);
	board.updatedAt = new Date(board.updatedAt);
	return board;
};

export const deleteColumnFromBoard = async ({
	boardId,
	columnId,
}: {
	boardId: string;
	columnId: string;
}): Promise<void> => {
	await apiClient.delete(`${BOARD_URL}${boardId}/columns/${columnId}/`);
};

export const moveColumnBefore = async ({
	columnId,
	boardId,
	targetColumnId,
}: {
	columnId: string;
	boardId: string;
	targetColumnId: string;
}): Promise<void> => {
	await apiClient.post(
		`${BOARD_URL}${boardId}/columns/${columnId}/move-before/`,
		{
			target_column_id: targetColumnId,
		},
	);
};

export const moveColumnEnd = async ({
	columnId,
	boardId,
}: {
	columnId: string;
	boardId: string;
}): Promise<void> => {
	await apiClient.post(`${BOARD_URL}${boardId}/columns/${columnId}/move-end/`);
};

export const getLatestBoard = async (): Promise<Board | null> => {
	const res = await apiClient.get(`${BOARD_URL}latest/`);
	if (res.status === 404) {
		return null;
	}
	const board = res.data;
	board.createdAt = new Date(board.createdAt);
	board.updatedAt = new Date(board.updatedAt);
	return board;
};
