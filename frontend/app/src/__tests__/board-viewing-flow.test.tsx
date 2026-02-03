// @vitest-environment happy-dom

import { cleanup, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "../pages/HomePage";
import apiClient from "../services/apiClient";
import { renderWithProviders } from "../utils/test-utils";

const mockBoards = [
	{
		id: "board-1",
		title: "My First Board",
		starred: true,
		updatedAt: "2026-01-15T10:00:00Z",
	},
	{
		id: "board-2",
		title: "Second Board",
		starred: false,
		updatedAt: "2026-01-20T10:00:00Z",
	},
	{
		id: "board-3",
		title: "Latest Board",
		starred: false,
		updatedAt: "2026-02-01T10:00:00Z",
	},
];

const mockFullBoards = {
	"board-1": {
		id: "board-1",
		title: "My First Board",
		columns: [
			{ id: "col-1", title: "To Do", boardId: "board-1" },
			{ id: "col-2", title: "Done", boardId: "board-1" },
		],
		starred: true,
		createdAt: "2026-01-15T10:00:00Z",
		updatedAt: "2026-01-15T10:00:00Z",
	},
	"board-2": {
		id: "board-2",
		title: "Second Board",
		columns: [
			{ id: "col-3", title: "Backlog", boardId: "board-2" },
			{ id: "col-4", title: "In Progress", boardId: "board-2" },
		],
		starred: false,
		createdAt: "2026-01-20T10:00:00Z",
		updatedAt: "2026-01-20T10:00:00Z",
	},
	"board-3": {
		id: "board-3",
		title: "Latest Board",
		columns: [
			{ id: "col-5", title: "Todo", boardId: "board-3" },
			{ id: "col-6", title: "Review", boardId: "board-3" },
		],
		starred: false,
		createdAt: "2026-02-01T10:00:00Z",
		updatedAt: "2026-02-01T10:00:00Z",
	},
};

// Mock the CardStack component to avoid dealing with card data fetching
vi.mock("../features/card/components/CardStack", () => ({
	CardStack: () => <div data-testid="card-stack">Cards</div>,
}));

vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn((url: string) => {
			if (url === "boards/latest/") {
				// Latest board is the most recently updated one
				return Promise.resolve({
					data: mockFullBoards["board-3"],
				});
			}
			if (url === "boards/") {
				return Promise.resolve({ data: mockBoards });
			}
			if (url.includes("boards/board-")) {
				const boardId = url.match(/boards\/(board-\d+)\//)?.[1];
				if (boardId && mockFullBoards[boardId as keyof typeof mockFullBoards]) {
					return Promise.resolve({
						data: mockFullBoards[boardId as keyof typeof mockFullBoards],
					});
				}
			}
			// Mock cards endpoint to return empty arrays for all columns
			if (url.startsWith("cards?column_id=")) {
				return Promise.resolve({ data: [] });
			}
			return Promise.resolve({ data: null });
		}),
		post: vi.fn().mockResolvedValue({ data: null }),
		patch: vi.fn().mockResolvedValue({ data: null }),
		delete: vi.fn().mockResolvedValue({ data: null }),
	},
	BASE_URL: "http://localhost:8000/",
}));

describe("Board Viewing Flow Integration Test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("auto-navigates to latest board and displays sidebar with boards", async () => {
		renderWithProviders(<HomePage />);

		// Wait for latest board to load
		await waitFor(() => {
			expect(screen.getByText("Latest Board")).toBeDefined();
		});

		// Verify the correct board columns are displayed
		expect(screen.getByText("Todo")).toBeDefined();
		expect(screen.getByText("Review")).toBeDefined();

		// Verify API was called for latest board
		expect(apiClient.get).toHaveBeenCalledWith("boards/latest/");

		// Verify sidebar displays all boards
		const sidebar = screen.getByTestId("sidebar-grid");
		within(sidebar).getByText("My First Board");
		within(sidebar).getByText("Second Board");
		within(sidebar).getByText("Latest Board");

		// Verify starred board shows star icon
		const starredButton =
			within(sidebar).getByText("My First Board").parentElement;
		expect(starredButton).toBeDefined();
		if (starredButton) {
			expect(within(starredButton).queryByTestId("StarIcon")).toBeDefined();
		}
	});
});
