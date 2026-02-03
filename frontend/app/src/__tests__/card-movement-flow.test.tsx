// @vitest-environment happy-dom

import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BoardPage } from "../pages/BoardPage";
import { renderWithProviders } from "../utils/test-utils";

const mockBoard = {
	id: "board-1",
	title: "Test Board",
	columns: [
		{ id: "col-1", title: "To Do", boardId: "board-1" },
		{ id: "col-2", title: "In Progress", boardId: "board-1" },
		{ id: "col-3", title: "Done", boardId: "board-1" },
	],
	starred: false,
	createdAt: "2026-01-15T10:00:00Z",
	updatedAt: "2026-01-15T10:00:00Z",
};

const mockCards: Record<
	string,
	Array<{
		id: string;
		title: string;
		body: string;
		priority: string;
		columnId: string;
		boardId: string;
		createdAt: string;
		updatedAt: string;
	}>
> = {
	"col-1": [
		{
			id: "card-1",
			title: "First Task",
			body: "Task description",
			priority: "high",
			columnId: "col-1",
			boardId: "board-1",
			createdAt: "2026-01-15T10:00:00Z",
			updatedAt: "2026-01-15T10:00:00Z",
		},
	],
	"col-2": [
		{
			id: "card-2",
			title: "Middle Task",
			body: "In progress task",
			priority: "low",
			columnId: "col-2",
			boardId: "board-1",
			createdAt: "2026-01-15T12:00:00Z",
			updatedAt: "2026-01-15T12:00:00Z",
		},
	],
	"col-3": [],
};

// Mock API client to return our test data
vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn((url: string, config?: { params?: Record<string, string> }) => {
			if (url === "boards/board-1/")
				return Promise.resolve({ data: mockBoard });
			if (url.startsWith("cards") || url === "cards/") {
				const columnId = config?.params?.column_id;
				return Promise.resolve({
					data: columnId
						? mockCards[columnId as keyof typeof mockCards] || []
						: [],
				});
			}
			return Promise.resolve({ data: null });
		}),
		patch: vi.fn((url: string, data: unknown) => {
			// Update mock data when card is updated
			const cardIdMatch = url.match(/cards\/(.+?)\//);
			if (cardIdMatch) {
				const cardId = cardIdMatch[1];
				const updateData = data as { columnId?: string };

				// Find and update card in mock data
				for (const colId in mockCards) {
					const cardIndex = mockCards[colId].findIndex((c) => c.id === cardId);
					if (cardIndex !== -1 && updateData.columnId) {
						const card = mockCards[colId][cardIndex];
						card.columnId = updateData.columnId;
						card.updatedAt = new Date().toISOString();
						return Promise.resolve({
							data: {
								...card,
								createdAt: new Date(card.createdAt).toISOString(),
								updatedAt: new Date(card.updatedAt).toISOString(),
							},
						});
					}
				}
			}
			return Promise.resolve({ data: null });
		}),
		post: vi.fn().mockResolvedValue({ data: null }),
	},
	BASE_URL: "http://localhost:8000/",
}));

vi.mock("react-router-dom", async () => ({
	...(await vi.importActual("react-router-dom")),
	useParams: () => ({ id: "board-1" }),
	useNavigate: () => vi.fn(),
}));

describe("Card Movement Flow", () => {
	// biome-ignore lint/correctness/noUnusedVariables: hoisted for potential use in mocks
	const apiClient = vi.hoisted(() => ({ patch: vi.fn() }));

	beforeEach(async () => {
		vi.clearAllMocks();
		// Reset mock data
		mockCards["col-1"] = [
			{
				id: "card-1",
				title: "First Task",
				body: "Task description",
				priority: "high",
				columnId: "col-1",
				boardId: "board-1",
				createdAt: "2026-01-15T10:00:00Z",
				updatedAt: "2026-01-15T10:00:00Z",
			},
		];
		mockCards["col-2"] = [
			{
				id: "card-2",
				title: "Middle Task",
				body: "In progress task",
				priority: "low",
				columnId: "col-2",
				boardId: "board-1",
				createdAt: "2026-01-15T12:00:00Z",
				updatedAt: "2026-01-15T12:00:00Z",
			},
		];
		mockCards["col-3"] = [];
	});
	afterEach(cleanup);

	it("moves card to next column using right arrow button", async () => {
		const user = userEvent.setup();
		const { default: apiClient } = await import("../services/apiClient");

		renderWithProviders(<BoardPage />);

		await waitFor(
			() => {
				const firstTask = screen.queryByText("First Task");
				expect(firstTask).toBeTruthy();
			},
			{ timeout: 3000 },
		);

		// Find the card and then find the right arrow button within it
		const firstTaskElement = screen.getByText("First Task");
		const cardPaper = firstTaskElement.closest(".MuiPaper-root");
		const rightArrowButton = cardPaper?.querySelector(
			'button svg[data-testid="ArrowRightIcon"]',
		)?.parentElement as HTMLElement;

		expect(rightArrowButton).toBeTruthy();
		await user.click(rightArrowButton);

		await waitFor(() =>
			expect(apiClient.patch).toHaveBeenCalledWith(
				"cards/card-1/",
				expect.objectContaining({ columnId: "col-2" }),
			),
		);
	});

	it("moves card to previous column using left arrow button", async () => {
		const user = userEvent.setup();
		const { default: apiClient } = await import("../services/apiClient");

		renderWithProviders(<BoardPage />);

		await waitFor(
			() => {
				const middleTask = screen.queryByText("Middle Task");
				expect(middleTask).toBeTruthy();
			},
			{ timeout: 3000 },
		);

		// Find the card and then find the left arrow button within it
		const middleTaskElement = screen.getByText("Middle Task");
		const cardPaper = middleTaskElement.closest(".MuiPaper-root");
		const leftArrowButton = cardPaper?.querySelector(
			'button svg[data-testid="ArrowLeftIcon"]',
		)?.parentElement as HTMLElement;

		expect(leftArrowButton).toBeTruthy();
		await user.click(leftArrowButton);

		await waitFor(() =>
			expect(apiClient.patch).toHaveBeenCalledWith(
				"cards/card-2/",
				expect.objectContaining({ columnId: "col-1" }),
			),
		);
	});

	it("disables left arrow on first column card", async () => {
		renderWithProviders(<BoardPage />);

		await waitFor(
			() => {
				const firstTask = screen.queryByText("First Task");
				expect(firstTask).toBeTruthy();
			},
			{ timeout: 3000 },
		);

		// First column cards should not have left arrow buttons
		const firstTaskElement = screen.getByText("First Task");
		const firstTaskParent = firstTaskElement.closest(".MuiPaper-root");

		// Check if the first task's parent contains any left arrow
		const leftArrowInFirstCard = firstTaskParent?.querySelector(
			'svg[data-testid="ArrowLeftIcon"]',
		);
		expect(leftArrowInFirstCard).toBeNull();
	});

	it("disables right arrow on last column card", async () => {
		// Set up data before rendering
		mockCards["col-3"] = [
			{
				id: "card-3",
				title: "Done Task",
				body: "Completed",
				priority: "low",
				columnId: "col-3",
				boardId: "board-1",
				createdAt: "2026-01-15T13:00:00Z",
				updatedAt: "2026-01-15T13:00:00Z",
			},
		];

		renderWithProviders(<BoardPage />);

		await waitFor(
			() => {
				const doneTask = screen.queryByText("Done Task");
				expect(doneTask).toBeTruthy();
			},
			{ timeout: 3000 },
		);

		// Last column cards should not have right arrow buttons
		const doneTaskElement = screen.getByText("Done Task");
		const doneTaskParent = doneTaskElement.closest(".MuiPaper-root");

		// Check if the done task's parent contains any right arrow
		const rightArrowInLastCard = doneTaskParent?.querySelector(
			'svg[data-testid="ArrowRightIcon"]',
		);
		expect(rightArrowInLastCard).toBeNull();
	});
});
