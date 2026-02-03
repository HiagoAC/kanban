// @vitest-environment happy-dom

import { DndContext } from "@dnd-kit/core";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SortableItem } from "../components/SortableItem";
import { CardItem } from "../features/card/components/CardItem";
import type { CardListItem } from "../features/card/types";
import { renderWithProviders } from "../utils/test-utils";

const mockMoveCardAbove = vi.fn();
const mockMoveCardBottom = vi.fn();
const mockUpdateCard = vi.fn();
const mockNavigate = vi.fn();

// Mock auth services to prevent CSRF token fetching
vi.mock("../features/auth/services", () => ({
	getCSRFToken: vi.fn(() => Promise.resolve()),
	getMe: vi.fn(() =>
		Promise.resolve({ id: "test-user", email: "test@example.com" }),
	),
	logout: vi.fn(() => Promise.resolve()),
}));

const mockCards: CardListItem[] = [
	{ id: "card-1", title: "First Card", priority: "high" },
	{ id: "card-2", title: "Second Card", priority: "medium" },
	{ id: "card-3", title: "Third Card", priority: "low" },
];

vi.mock("../features/card/hooks/useMoveCardAbove", () => ({
	useMoveCardAbove: () => ({
		mutate: (variables: { cardId: string; aboveCardId: string }) => {
			mockMoveCardAbove(variables);
			return Promise.resolve();
		},
		mutateAsync: (variables: { cardId: string; aboveCardId: string }) => {
			mockMoveCardAbove(variables);
			return Promise.resolve();
		},
		isPending: false,
		isError: false,
	}),
}));

vi.mock("../features/card/hooks/useMoveCardBottom", () => ({
	useMoveCardBottom: () => ({
		mutate: (variables: { cardId: string; columnId: string }) => {
			mockMoveCardBottom(variables);
			return Promise.resolve();
		},
		mutateAsync: (variables: { cardId: string; columnId: string }) => {
			mockMoveCardBottom(variables);
			return Promise.resolve();
		},
		isPending: false,
		isError: false,
	}),
}));

vi.mock("../features/card/hooks/useUpdateCard", () => ({
	useUpdateCard: () => ({
		mutate: (variables: { id: string; cardData: Record<string, unknown> }) => {
			mockUpdateCard(variables);
			return Promise.resolve();
		},
		mutateAsync: (variables: {
			id: string;
			cardData: Record<string, unknown>;
		}) => {
			mockUpdateCard(variables);
			return Promise.resolve();
		},
		isPending: false,
		isError: false,
	}),
}));

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("Card Drag-and-Drop Integration Tests", () => {
	beforeEach(() => {
		mockMoveCardAbove.mockClear();
		mockMoveCardBottom.mockClear();
		mockUpdateCard.mockClear();
		mockNavigate.mockClear();
	});

	afterEach(() => {
		cleanup();
	});

	describe("CardItem Component", () => {
		const mockDragListeners = { onPointerDown: vi.fn() };

		it("renders card elements, navigates on click, and shows/hides arrows", async () => {
			const { rerender } = renderWithProviders(
				<CardItem
					card={mockCards[0]}
					columnId="col-1"
					prevColumnId="col-0"
					nextColumnId="col-2"
					dragListeners={mockDragListeners}
				/>,
			);

			// Check rendering
			expect(screen.getByText("First Card")).not.toBeNull();
			expect(screen.getByText("high-priority")).not.toBeNull();
			expect(screen.getByLabelText("Drag card")).not.toBeNull();
			expect(screen.getAllByTestId("ArrowLeftIcon").length).toBeGreaterThan(0);
			expect(screen.getAllByTestId("ArrowRightIcon").length).toBeGreaterThan(0);

			// Test navigation
			const user = userEvent.setup({ delay: null });
			await user.click(screen.getByText("First Card"));
			expect(mockNavigate).toHaveBeenCalledWith("/cards/card-1");

			// Test conditional arrows
			rerender(
				<CardItem
					card={mockCards[0]}
					columnId="col-1"
					nextColumnId="col-2"
					dragListeners={mockDragListeners}
				/>,
			);
			expect(screen.queryAllByTestId("ArrowLeftIcon").length).toBe(0);
		});

		it("moves card between columns via arrow clicks", async () => {
			renderWithProviders(
				<CardItem
					card={mockCards[0]}
					columnId="col-1"
					prevColumnId="col-0"
					nextColumnId="col-2"
					dragListeners={mockDragListeners}
				/>,
			);

			const user = userEvent.setup({ delay: null });
			const leftButton = screen
				.getAllByTestId("ArrowLeftIcon")[0]
				.closest("button");
			expect(leftButton).not.toBeNull();
			if (leftButton) {
				await user.click(leftButton);
			}
			expect(mockUpdateCard).toHaveBeenCalledWith({
				id: "card-1",
				cardData: { columnId: "col-0" },
			});
			expect(mockNavigate).not.toHaveBeenCalled();

			mockUpdateCard.mockClear();
			const rightButton = screen
				.getAllByTestId("ArrowRightIcon")[0]
				.closest("button");
			expect(rightButton).not.toBeNull();
			if (rightButton) {
				await user.click(rightButton);
			}
			expect(mockUpdateCard).toHaveBeenCalledWith({
				id: "card-1",
				cardData: { columnId: "col-2" },
			});
		});

		it("displays all priority levels", () => {
			const { rerender } = renderWithProviders(
				<CardItem
					card={mockCards[0]}
					columnId="col-1"
					dragListeners={mockDragListeners}
				/>,
			);
			expect(screen.getByText("high-priority")).not.toBeNull();

			rerender(
				<CardItem
					card={mockCards[1]}
					columnId="col-1"
					dragListeners={mockDragListeners}
				/>,
			);
			expect(screen.getByText("medium-priority")).not.toBeNull();

			rerender(
				<CardItem
					card={mockCards[2]}
					columnId="col-1"
					dragListeners={mockDragListeners}
				/>,
			);
			expect(screen.getByText("low-priority")).not.toBeNull();
		});
	});

	describe("SortableItem Component", () => {
		it("renders with drag listeners, styles, and multiple items", () => {
			const mockChild = vi.fn(({ dragListeners }) => (
				<div data-testid="sortable-child">
					<button {...dragListeners} data-testid="drag-button">
						Drag
					</button>
				</div>
			));

			render(
				<DndContext>
					{/* biome-ignore lint/correctness/useUniqueElementIds: static ID is fine in test environment */}
					<SortableItem id="test-item">{mockChild}</SortableItem>
				</DndContext>,
			);

			expect(screen.getByTestId("sortable-child")).not.toBeNull();
			expect(mockChild).toHaveBeenCalledWith(
				expect.objectContaining({ dragListeners: expect.any(Object) }),
			);
			const sortableElement =
				screen.getByTestId("sortable-child").parentElement;
			expect(sortableElement?.style.opacity).toBe("1");
		});
	});
});
