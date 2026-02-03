// @vitest-environment happy-dom

import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CardPage } from "../pages/CardPage";
import apiClient from "../services/apiClient";
import { renderWithProviders } from "../utils/test-utils";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useParams: () => ({ id: "card-1" }),
		useNavigate: () => vi.fn(),
	};
});

vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn((url: string) => {
			if (url.includes("cards/card-1")) {
				return Promise.resolve({
					data: {
						id: "card-1",
						title: "Test Card",
						body: "Card description",
						priority: "medium",
						columnId: "col-1",
						boardId: "board-1",
						createdAt: "2026-01-15T10:00:00Z",
						updatedAt: "2026-01-15T10:00:00Z",
					},
				});
			}
			if (url.includes("boards/board-1")) {
				return Promise.resolve({
					data: {
						id: "board-1",
						title: "Test Board",
						columns: [
							{ id: "col-1", title: "To Do", boardId: "board-1" },
							{ id: "col-2", title: "In Progress", boardId: "board-1" },
						],
						starred: false,
						createdAt: "2026-01-01T10:00:00Z",
						updatedAt: "2026-01-01T10:00:00Z",
					},
				});
			}
			if (url === "boards/" || url.includes("boards?")) {
				return Promise.resolve({ data: [] });
			}
			return Promise.resolve({ data: null });
		}),
		patch: vi.fn().mockResolvedValue({
			data: {
				id: "card-1",
				title: "Test Card",
				body: "Card description",
				priority: "medium",
				columnId: "col-1",
				boardId: "board-1",
				createdAt: "2026-01-15T10:00:00Z",
				updatedAt: "2026-01-15T10:00:00Z",
			},
		}),
		delete: vi.fn().mockResolvedValue({ data: null }),
	},
	BASE_URL: "http://localhost:8000/",
}));

describe("Card Editing Flow Integration Test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("loads and displays card data", async () => {
		renderWithProviders(<CardPage />);

		await waitFor(() => {
			expect(screen.getByDisplayValue("Test Card")).toBeDefined();
		});

		expect(screen.getByDisplayValue("Card description")).toBeDefined();
		expect(screen.getByDisplayValue("medium")).toBeDefined();
	});

	it("edits card and saves changes", async () => {
		const mockNavigate = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: Mocking requires any for test setup
		(vi.mocked(await import("react-router-dom")).useNavigate as any) = () =>
			mockNavigate;

		renderWithProviders(<CardPage />);
		const user = userEvent.setup({ delay: null });

		await waitFor(() => {
			expect(screen.getByDisplayValue("Test Card")).toBeDefined();
		});

		// Edit title and body
		const titleInput = screen.getByDisplayValue("Test Card");
		await user.clear(titleInput);
		await user.type(titleInput, "Updated Card");

		const bodyInput = screen.getByDisplayValue("Card description");
		await user.clear(bodyInput);
		await user.type(bodyInput, "New description");

		// Save
		const saveButton = screen.getByRole("button", { name: /save changes/i });
		await user.click(saveButton);

		// Verify API call and navigation
		await waitFor(() => {
			expect(apiClient.patch).toHaveBeenCalledWith(
				"cards/card-1/",
				expect.objectContaining({
					title: "Updated Card",
					body: "New description",
				}),
			);
		});
		expect(mockNavigate).toHaveBeenCalledWith("/boards/board-1");
	});

	it("cancels edits and reverts changes", async () => {
		renderWithProviders(<CardPage />);
		const user = userEvent.setup({ delay: null });

		await waitFor(() => {
			expect(screen.getByDisplayValue("Test Card")).toBeDefined();
		});

		// Make changes
		const titleInput = screen.getByDisplayValue("Test Card");
		await user.clear(titleInput);
		await user.type(titleInput, "Changed");

		// Cancel
		const cancelButton = screen.getByRole("button", { name: /cancel/i });
		await user.click(cancelButton);

		// Verify original value restored
		await waitFor(() => {
			expect(screen.getByDisplayValue("Test Card")).toBeDefined();
		});
		expect(apiClient.patch).not.toHaveBeenCalled();
	});

	it("deletes card with confirmation", async () => {
		const mockNavigate = vi.fn();
		// biome-ignore lint/suspicious/noExplicitAny: Mocking requires any for test setup
		(vi.mocked(await import("react-router-dom")).useNavigate as any) = () =>
			mockNavigate;

		renderWithProviders(<CardPage />);
		const user = userEvent.setup({ delay: null });

		await waitFor(() => {
			expect(screen.getByDisplayValue("Test Card")).toBeDefined();
		});

		// Click delete
		const deleteButton = screen.getByRole("button", { name: /delete/i });
		await user.click(deleteButton);

		// Confirm
		await waitFor(() => {
			expect(screen.getByText(/are you sure/i)).toBeDefined();
		});
		const confirmButton = screen.getByRole("button", { name: /delete card/i });
		await user.click(confirmButton);

		// Verify deletion
		await waitFor(() => {
			expect(apiClient.delete).toHaveBeenCalledWith("cards/card-1/");
		});
		expect(mockNavigate).toHaveBeenCalledWith("/boards/board-1");
	});
}, 15000);
