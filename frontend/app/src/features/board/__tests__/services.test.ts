import { describe, expect, it, vi, beforeEach } from "vitest";
import apiClient from "../../../services/apiClient";
import {
	fetchBoards,
	createBoard,
	getBoard,
	updateBoard,
	deleteBoard,
	addColumnToBoard,
	updateColumnInBoard,
	deleteColumnFromBoard,
	moveColumnBefore,
	moveColumnEnd,
	getLatestBoard,
} from "../services";

vi.mock("../../../services/apiClient");

beforeEach(() => {
	vi.clearAllMocks();
});

describe("fetchBoards", () => {
	it("should fetch boards data and convert updatedAt to Date", async () => {
		const mockData = [
			{ id: 1, title: "Board 1", updatedAt: "2024-01-01T00:00:00Z" },
			{ id: 2, title: "Board 2", updatedAt: "2024-01-02T00:00:00Z" },
		];

		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockData });

		const res = await fetchBoards();

		expect(apiClient.get).toHaveBeenCalledWith("boards/");
		expect(res[0].updatedAt).toBeInstanceOf(Date);
		expect(res[1].updatedAt).toBeInstanceOf(Date);
	});
});

describe("createBoard", () => {
	it("should create a new board", async () => {
		const newBoard = {
			title: "New Board",
			columns: ["To Do", "In Progress"],
		};

		const mockResponse = {
			id: 1,
			title: "New Board",
			columns: [],
		};

		(apiClient.post as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await createBoard(newBoard);

		expect(apiClient.post).toHaveBeenCalledWith("boards/", newBoard);
		expect(res).toEqual(mockResponse);
	});
});

describe("getBoard", () => {
	it("should fetch a board by id and convert dates", async () => {
		const mockResponse = {
			id: 1,
			title: "Board",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
			columns: [],
		};

		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await getBoard("1");

		expect(apiClient.get).toHaveBeenCalledWith("boards/1/");
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("updateBoard", () => {
	it("should update a board and convert dates", async () => {
		const mockResponse = {
			id: 1,
			title: "Updated Board",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-03T00:00:00Z",
			columns: [],
		};

		(apiClient.patch as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await updateBoard({
			id: "1",
			boardData: { title: "Updated Board" },
		});

		expect(apiClient.patch).toHaveBeenCalledWith(
			"boards/1/",
			{ title: "Updated Board" },
		);
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("deleteBoard", () => {
	it("should delete a board by id", async () => {
		(apiClient.delete as vi.Mock).mockResolvedValue({});

		await deleteBoard("1");

		expect(apiClient.delete).toHaveBeenCalledWith("boards/1/");
	});
});

describe("addColumnToBoard", () => {
	it("should add a column to a board", async () => {
		const mockResponse = {
			id: 1,
			title: "Board",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
			columns: [{ id: 1, title: "New Column" }],
		};

		(apiClient.post as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await addColumnToBoard("1", "New Column");

		expect(apiClient.post).toHaveBeenCalledWith(
			"boards/1/columns/",
			{ title: "New Column" },
		);
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("updateColumnInBoard", () => {
	it("should update a column in a board", async () => {
		const mockResponse = {
			id: 1,
			title: "Board",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-03T00:00:00Z",
			columns: [{ id: 2, title: "Updated Column" }],
		};

		(apiClient.patch as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await updateColumnInBoard({
			boardId: "1",
			columnId: "2",
			columnData: { title: "Updated Column" },
		});

		expect(apiClient.patch).toHaveBeenCalledWith(
			"boards/1/columns/2/",
			{ title: "Updated Column" },
		);
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("deleteColumnFromBoard", () => {
	it("should delete a column from a board", async () => {
		(apiClient.delete as vi.Mock).mockResolvedValue({});

		await deleteColumnFromBoard({
			boardId: "1",
			columnId: "2",
		});

		expect(apiClient.delete).toHaveBeenCalledWith(
			"boards/1/columns/2/",
		);
	});
});

describe("moveColumnBefore", () => {
	it("should move a column before another column", async () => {
		(apiClient.post as vi.Mock).mockResolvedValue({});

		await moveColumnBefore({
			boardId: "1",
			columnId: "2",
			targetColumnId: "3",
		});

		expect(apiClient.post).toHaveBeenCalledWith(
			"boards/1/columns/2/move-before/",
			{ target_column_id: "3" },
		);
	});
});

describe("moveColumnEnd", () => {
	it("should move a column to the end", async () => {
		(apiClient.post as vi.Mock).mockResolvedValue({});

		await moveColumnEnd({
			boardId: "1",
			columnId: "2",
		});

		expect(apiClient.post).toHaveBeenCalledWith(
			"boards/1/columns/2/move-end/",
		);
	});
});

describe("getLatestBoard", () => {
	it("should return the latest board", async () => {
		const mockResponse = {
			id: 1,
			title: "Latest Board",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
			columns: [],
		};

		(apiClient.get as vi.Mock).mockResolvedValue({
			status: 200,
			data: mockResponse,
		});

		const res = await getLatestBoard();

		expect(apiClient.get).toHaveBeenCalledWith("boards/latest/");
		expect(res?.createdAt).toBeInstanceOf(Date);
		expect(res?.updatedAt).toBeInstanceOf(Date);
	});

	it("should return null when latest board does not exist", async () => {
		(apiClient.get as vi.Mock).mockResolvedValue({
			status: 404,
		});

		const res = await getLatestBoard();

		expect(res).toBeNull();
	});
});
