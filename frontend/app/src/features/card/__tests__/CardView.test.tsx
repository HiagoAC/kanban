// @vitest-environment jsdom

import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../../services/apiClient";
import { renderWithProviders } from "../../../utils/test-utils";
import type { Board } from "../../board/types";
import { CardView } from "../components/CardView";
import type { Card, Priority } from "../types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
	...(await vi.importActual<typeof import("react-router-dom")>(
		"react-router-dom",
	)),
	useNavigate: () => mockNavigate,
}));

vi.mock("../../../services/apiClient", () => ({
	default: {
		get: vi.fn(),
	},
	BASE_URL: "http://localhost:8000",
}));

(apiClient.get as vi.Mock).mockImplementation((url: string) => {
	if (url === "me/" || url === "/me/") {
		return Promise.resolve({
			data: {
				id: 1,
				email: "test@example.com",
				firstName: "Test",
				lastName: "User",
				isGuest: false,
			},
		});
	}
	if (url === "csrf/" || url === "/csrf/") {
		return Promise.resolve({ data: {} });
	}
	return Promise.reject(new Error(`Unmocked GET: ${url}`));
});

const mockGetCard = vi.fn();
const mockGetBoard = vi.fn();
const mockUpdateCard = vi.fn();
const mockDeleteCard = vi.fn();
const mockSetActiveBoardId = vi.fn();

vi.mock("../hooks/useGetCard", () => ({
	useGetCard: (id: string) => mockGetCard(id),
}));

vi.mock("../../board/hooks/useGetBoard", () => ({
	useGetBoard: (id?: string) => mockGetBoard(id),
}));

vi.mock("../hooks/useUpdateCard", () => ({
	useUpdateCard: () => ({ mutate: mockUpdateCard }),
}));

vi.mock("../hooks/useDeleteCard", () => ({
	useDeleteCard: () => ({ mutate: mockDeleteCard }),
}));

vi.mock("../../board/contexts/ActiveBoardContext", async () => {
	const actual = await vi.importActual<
		typeof import("../../board/contexts/ActiveBoardContext")
	>("../../board/contexts/ActiveBoardContext");
	return {
		...actual,
		useActiveBoard: () => ({ setActiveBoardId: mockSetActiveBoardId }),
	};
});

vi.mock("../components/CardActionBar", () => ({
	CardActionBar: () => <div data-testid="card-action-bar" />,
}));

vi.mock("../components/CardEditControls", () => ({
	CardEditControls: ({
		handleDelete,
		setCardData,
		cardData,
	}: {
		handleDelete: () => void;
		setCardData: React.Dispatch<React.SetStateAction<Card>>;
		cardData: Card;
	}) => (
		<div data-testid="card-edit-controls">
			<button type="button" onClick={handleDelete} data-testid="delete-btn">
				Delete
			</button>
			<button
				type="button"
				onClick={() => setCardData({ ...cardData, priority: "high" })}
				data-testid="priority-btn"
			>
				Priority
			</button>
		</div>
	),
}));

const card = (o?: Partial<Card>): Card => ({
	id: "card-1",
	title: "Test Card",
	body: "Test body",
	priority: "medium" as Priority,
	columnId: "col-1",
	boardId: "board-1",
	createdAt: new Date(),
	updatedAt: new Date(),
	...o,
});

const board = (): Board => ({
	id: "board-1",
	title: "Test Board",
	starred: false,
	columns: [{ id: "col-1", title: "To Do" }],
	createdAt: new Date(),
	updatedAt: new Date(),
});

// biome-ignore lint/correctness/useUniqueElementIds: Testing with hardcoded ID is acceptable
const render_ = () => renderWithProviders(<CardView id="card-1" />);

describe("CardView", () => {
	beforeEach(() => vi.clearAllMocks());
	afterEach(cleanup);

	it("shows loading state", () => {
		mockGetCard.mockReturnValue({ data: undefined, isLoading: true });
		mockGetBoard.mockReturnValue({ data: undefined });
		render_();
		expect(screen.getByText("Loading...")).toBeTruthy();
	});

	it("loads and displays card data, sets active board", () => {
		mockGetCard.mockReturnValue({ data: card(), isLoading: false });
		mockGetBoard.mockReturnValue({ data: board() });
		render_();
		expect(screen.getByDisplayValue("Test Card")).toBeTruthy();
		expect(screen.getByDisplayValue("Test body")).toBeTruthy();
		expect(mockSetActiveBoardId).toHaveBeenCalledWith("board-1");
	});

	it("does not set active board when board is undefined", () => {
		mockGetCard.mockReturnValue({ data: card(), isLoading: false });
		mockGetBoard.mockReturnValue({ data: undefined });
		render_();
		expect(mockSetActiveBoardId).not.toHaveBeenCalled();
	});

	it(
		"updates title and body",
		async () => {
			const user = userEvent.setup();
			mockGetCard.mockReturnValue({ data: card(), isLoading: false });
			mockGetBoard.mockReturnValue({ data: board() });
			render_();

			const titleInput = screen.getByDisplayValue("Test Card");
			await user.clear(titleInput);
			await user.type(titleInput, "New Title");

			const bodyInput = screen.getByLabelText("Notes");
			await user.clear(bodyInput);
			await user.type(bodyInput, "New body");

			expect(screen.getByDisplayValue("New Title")).toBeTruthy();
			expect(screen.getByDisplayValue("New body")).toBeTruthy();
		},
		10000,
	);

	it("saves changes and navigates", async () => {
		const user = userEvent.setup();
		mockGetCard.mockReturnValue({ data: card(), isLoading: false });
		mockGetBoard.mockReturnValue({ data: board() });
		render_();

		const titleInput = screen.getByDisplayValue("Test Card");
		await user.click(titleInput);
		await user.clear(titleInput);
		await user.type(titleInput, "Updated");
		await user.click(screen.getByText("Save Changes"));

		expect(mockUpdateCard).toHaveBeenCalledWith({
			id: "card-1",
			cardData: expect.objectContaining({ title: "Updated" }),
		});
		expect(mockNavigate).toHaveBeenCalledWith("/boards/board-1");
	});

	it("cancels changes and resets to original", async () => {
		const user = userEvent.setup();
		mockGetCard.mockReturnValue({
			data: card({ title: "Original" }),
			isLoading: false,
		});
		mockGetBoard.mockReturnValue({ data: board() });
		render_();

		const titleInput = screen.getByDisplayValue("Original");
		await user.click(titleInput);
		await user.clear(titleInput);
		await user.type(titleInput, "Changed");
		await user.click(screen.getByText("Cancel"));

		await waitFor(() =>
			expect(screen.getByDisplayValue("Original")).toBeTruthy(),
		);
	});

	it("deletes card and navigates", async () => {
		const user = userEvent.setup();
		mockGetCard.mockReturnValue({ data: card(), isLoading: false });
		mockGetBoard.mockReturnValue({ data: board() });
		render_();

		await user.click(screen.getByTestId("delete-btn"));

		expect(mockDeleteCard).toHaveBeenCalledWith("card-1");
		expect(mockNavigate).toHaveBeenCalledWith("/boards/board-1");
	});

	it("allows child components to update cardData", async () => {
		const user = userEvent.setup();
		mockGetCard.mockReturnValue({ data: card(), isLoading: false });
		mockGetBoard.mockReturnValue({ data: board() });
		render_();

		await user.click(screen.getByTestId("priority-btn"));
		await user.click(screen.getByText("Save Changes"));

		expect(mockUpdateCard).toHaveBeenCalledWith({
			id: "card-1",
			cardData: expect.objectContaining({ priority: "high" }),
		});
	});

	it("excludes id, createdAt, updatedAt from cardData", async () => {
		const user = userEvent.setup();
		mockGetCard.mockReturnValue({ data: card(), isLoading: false });
		mockGetBoard.mockReturnValue({ data: board() });
		render_();

		await user.click(screen.getByText("Save Changes"));

		const callArg = mockUpdateCard.mock.calls[0][0];
		expect(callArg.cardData).not.toHaveProperty("id");
		expect(callArg.cardData).not.toHaveProperty("createdAt");
		expect(callArg.cardData).not.toHaveProperty("updatedAt");
	});

	it("handles edge cases", () => {
		mockGetCard.mockReturnValue({
			// biome-ignore lint/suspicious/noExplicitAny: Testing edge case with invalid data type
			data: card({ boardId: undefined as any }),
			isLoading: false,
		});
		mockGetBoard.mockReturnValue({ data: undefined });
		render_();
		expect(mockGetBoard).toHaveBeenCalledWith(undefined);
	});
});
