// @vitest-environment happy-dom

import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NewBoardPage } from "../pages/NewBoardPage";
import apiClient from "../services/apiClient";
import { renderWithProviders } from "../utils/test-utils";

vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn().mockResolvedValue({ data: null }),
		post: vi.fn().mockResolvedValue({
			data: {
				id: "new-board-123",
				title: "My New Board",
				columns: [],
			},
		}),
	},
	BASE_URL: "http://localhost:8000/",
}));

const mockNavigate = vi.fn();
const mockShowPrompt = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("../features/auth/contexts/SignInPromptContext", async () => {
	const actual = await vi.importActual(
		"../features/auth/contexts/SignInPromptContext",
	);
	return {
		...actual,
		useSignInPrompt: () => ({
			showPrompt: mockShowPrompt,
		}),
	};
});

describe("Board Creation Flow Integration Test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("allows user to create a new board", async () => {
		renderWithProviders(<NewBoardPage />);

		const user = userEvent.setup({ delay: null });

		// Verify page heading
		screen.getByRole("heading", {
			name: /create new kanban board/i,
		});

		// Fill board title
		const titleInput = screen.getByRole("textbox", { name: /board title/i });
		await user.type(titleInput, "My New Board");

		// Add a column
		const columnInput = screen.getByRole("textbox", { name: /add column/i });
		await user.type(columnInput, "To Do{Enter}");

		// Verify column was added
		screen.getByText("To Do");

		// Submit the form
		const createButton = screen.getByRole("button", { name: /create board/i });
		await user.click(createButton);

		// Verify the API was called with correct data
		expect(apiClient.post).toHaveBeenCalledWith("boards/", {
			title: "My New Board",
			columns: ["To Do", "In Progress", "Done"],
		});

		// Verify navigation happened
		expect(mockNavigate).toHaveBeenCalledWith("/boards/new-board-123");
	}, 15000);
});
