import { describe, expect, it, vi } from "vitest";
import apiClient from "../../../services/apiClient";
import { createBoard, fetchBoards, getBoard, updateBoard } from "../services";

vi.mock("../../../services/apiClient");

describe("fetchBoards", () => {
	it("should fetch boards data", async () => {
		const mockData = [
			{ id: 1, name: "Board 1" },
			{ id: 2, name: "Board 2" },
		];
		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockData });

		const res = await fetchBoards();

		expect(apiClient.get).toHaveBeenCalledWith("boards/");
		expect(res).toEqual(mockData);
	});
});

describe("createBoard", () => {
	it("should create a new board", async () => {
		const newBoard = {
			title: "New Board",
			columns: ["To Do", "In Progress", "Done"],
		};
		const mockResponse = {
			id: 3,
			title: "New Board",
			created_at: "2024-01-01T00:00:00Z",
			columns: [
				{ id: 1, title: "To Do" },
				{ id: 2, title: "In Progress" },
				{ id: 3, title: "Done" },
			],
		};
		(apiClient.post as vi.Mock).mockResolvedValue({ data: mockResponse });
		const res = await createBoard(newBoard);
		expect(apiClient.post).toHaveBeenCalledWith("boards/", newBoard);
		expect(res).toEqual(mockResponse);
	});
});

describe("getBoard", () => {
	it("should fetch a board by id", async () => {
		const boardId = "1";
		const mockResponse = {
			id: 1,
			title: "Board 1",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
			columns: [
				{ id: 1, title: "To Do" },
				{ id: 2, title: "In Progress" },
				{ id: 3, title: "Done" },
			],
		};
		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await getBoard(boardId);

		expect(apiClient.get).toHaveBeenCalledWith(`boards/${boardId}/`);
		expect(res).toEqual({
			...mockResponse,
			createdAt: new Date(mockResponse.createdAt),
			updatedAt: new Date(mockResponse.updatedAt),
		});
	});
});

describe("updateBoard", () => {
	it("should update a board by id", async () => {
		const boardId = "1";
		const boardData = {
			title: "Updated Board Title",
		};
		const mockResponse = {
			id: 1,
			title: "Updated Board Title",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-03T00:00:00Z",
			columns: [
				{ id: 1, title: "To Do" },
				{ id: 2, title: "In Progress" },
				{ id: 3, title: "Done" },
			],
		};
		(apiClient.patch as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await updateBoard({ id: boardId, boardData });

		expect(apiClient.patch).toHaveBeenCalledWith(
			`boards/${boardId}/`,
			boardData,
		);
		expect(res).toEqual(mockResponse);
	});
});
