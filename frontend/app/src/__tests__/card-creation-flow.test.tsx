// @vitest-environment happy-dom

import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateCardDialogue } from "../features/card/components/CreateCardDialogue";
import { renderWithProviders } from "../utils/test-utils";

vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn().mockResolvedValue({ data: null }),
		post: vi.fn(),
	},
	BASE_URL: "http://localhost:8000/",
}));

vi.mock("../features/auth/hooks/useAuth", () => ({
	useAuth: () => ({
		user: null,
		isLoading: false,
	}),
}));

const mockShowPrompt = vi.fn();

vi.mock("../features/auth/contexts/SignInPromptContext", () => ({
	useSignInPrompt: () => ({
		showPrompt: mockShowPrompt,
	}),
	SignInPromptProvider: ({ children }: { children: React.ReactNode }) =>
		children,
}));

import apiClient from "../services/apiClient";

const mockColumn = {
	id: "col-1",
	title: "To Do",
	boardId: "board-1",
};

const mockBoard = {
	id: "board-1",
	title: "Test Board",
	columns: [mockColumn],
	starred: false,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("Card Creation Flow Integration Test", () => {
	const mockCreateCardApi = vi.mocked(apiClient.post);

	beforeEach(() => {
		mockCreateCardApi.mockClear();
		mockShowPrompt.mockClear();
		mockCreateCardApi.mockResolvedValue({
			data: {
				id: "card-1",
				title: "New Task",
				body: "Task description here",
				priority: "high",
				columnId: "col-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
	});

	afterEach(() => {
		cleanup();
	});

	it("allows user to create a new card", async () => {
		const mockOnClose = vi.fn();

		renderWithProviders(
			<CreateCardDialogue
				open={true}
				onClose={mockOnClose}
				column={mockColumn}
				board={mockBoard}
			/>,
		);

		const user = userEvent.setup({ delay: null });

		// Verify dialog title
		screen.getByText(/create new card at to do \/ test board/i);

		// Fill card title
		const titleInput = screen.getByRole("textbox", { name: /title/i });
		await user.type(titleInput, "New Task");

		// Select priority
		const highPriorityRadio = screen.getByRole("radio", { name: /high/i });
		await user.click(highPriorityRadio);

		// Fill card body
		const bodyInput = screen.getByRole("textbox", { name: /body/i });
		await user.type(bodyInput, "Task description here");

		// Submit the form
		const createButton = screen.getByRole("button", { name: /^create$/i });
		await user.click(createButton);

		// Verify the API was called with correct data
		expect(mockCreateCardApi).toHaveBeenCalledWith("cards/", {
			columnId: "col-1",
			title: "New Task",
			body: "Task description here",
			priority: "high",
		});

		// Verify dialog was closed
		expect(mockOnClose).toHaveBeenCalled();
	}, 15000);

	it("allows user to discard card creation", async () => {
		const mockOnClose = vi.fn();

		renderWithProviders(
			<CreateCardDialogue
				open={true}
				onClose={mockOnClose}
				column={mockColumn}
				board={mockBoard}
			/>,
		);

		const user = userEvent.setup({ delay: null });

		// Verify dialog is open
		screen.getByText(/create new card at to do \/ test board/i);

		// Click discard button
		const discardButton = screen.getByRole("button", { name: /discard/i });
		await user.click(discardButton);

		// Verify the API was NOT called
		expect(mockCreateCardApi).not.toHaveBeenCalled();

		// Verify dialog was closed
		expect(mockOnClose).toHaveBeenCalled();
	}, 15000);
});
