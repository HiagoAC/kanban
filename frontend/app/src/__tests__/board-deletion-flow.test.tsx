// @vitest-environment happy-dom

import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "../pages/HomePage";
import apiClient from "../services/apiClient";
import { renderWithProviders } from "../utils/test-utils";

const mockBoards = [
	{
		id: "board-1",
		title: "Board to Delete",
		starred: false,
		updatedAt: "2026-01-15T10:00:00Z",
	},
	{
		id: "board-2",
		title: "Another Board",
		starred: false,
		updatedAt: "2026-01-20T10:00:00Z",
	},
];

const mockFullBoard = {
	id: "board-1",
	title: "Board to Delete",
	columns: [
		{ id: "col-1", title: "To Do", boardId: "board-1" },
		{ id: "col-2", title: "Done", boardId: "board-1" },
	],
	starred: false,
	createdAt: "2026-01-15T10:00:00Z",
	updatedAt: "2026-01-15T10:00:00Z",
};

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useParams: () => ({ boardId: "board-1" }),
	};
});

// Mock the CardStack component to avoid dealing with card data fetching
vi.mock("../features/card/components/CardStack", () => ({
	CardStack: () => <div data-testid="card-stack">Cards</div>,
}));

vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn((url: string) => {
			if (url === "boards/") {
				return Promise.resolve({ data: mockBoards });
			}
			if (url === "boards/latest/") {
				return Promise.resolve({ data: mockFullBoard });
			}
			if (url === "boards/board-1/") {
				return Promise.resolve({ data: mockFullBoard });
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

describe("Board Deletion Flow Integration Test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("allows user to delete a board", async () => {
		renderWithProviders(<HomePage />);

		const user = userEvent.setup({ delay: null });

		// Wait for the board to load
		await waitFor(() => {
			expect(screen.getByText("Board to Delete")).toBeDefined();
		});

		// Find and click the board options menu button (MoreHorizIcon)
		const allButtons = screen.getAllByRole("button");
		// Find the first button with aria-haspopup="true" (board options menu)
		const menuButton = allButtons.find(
			(btn) => btn.getAttribute("aria-haspopup") === "true",
		);
		if (!menuButton) {
			throw new Error("Could not find board options menu button");
		}
		await user.click(menuButton);

		// Click the "Delete Board" option
		const deleteOption = await screen.findByText("Delete Board");
		await user.click(deleteOption);

		// Confirm deletion in the dialog
		const confirmButton = await screen.findByRole("button", {
			name: /delete board/i,
		});
		await user.click(confirmButton);

		// Verify the delete API was called with correct board ID
		expect(apiClient.delete).toHaveBeenCalledWith("boards/board-1/");

		// Verify navigation to home page
		expect(mockNavigate).toHaveBeenCalledWith("/");
	}, 15000);
});
