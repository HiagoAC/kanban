import { describe, expect, it, vi } from "vitest";
import apiClient from "../../../services/apiClient";
import { fetchBoards, createBoard } from "../services";

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
		const newBoard = { title: "New Board", columns: ["To Do", "In Progress", "Done"] };
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
