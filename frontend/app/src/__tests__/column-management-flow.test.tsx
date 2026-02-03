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

vi.mock("../features/card/components/CardStack", () => ({
	CardStack: () => <div data-testid="card-stack">Cards</div>,
}));

const mockAddColumn = vi.fn();
const mockDeleteColumn = vi.fn();
const mockUpdateColumn = vi.fn();

vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn((url: string) => {
			if (url === "boards/board-1/")
				return Promise.resolve({ data: mockBoard });
			if (url.startsWith("cards?column_id="))
				return Promise.resolve({ data: [] });
			return Promise.resolve({ data: null });
		}),
		post: vi.fn().mockResolvedValue({ data: null }),
		patch: vi.fn().mockResolvedValue({ data: null }),
		delete: vi.fn().mockResolvedValue({ data: null }),
	},
	BASE_URL: "http://localhost:8000/",
}));

vi.mock("../features/board/services", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("../features/board/services")>();
	return {
		...actual,
		addColumnToBoard: vi.fn((boardId: string, columnTitle: string) => {
			mockAddColumn({ boardId, columnTitle });
			return Promise.resolve({ ...mockBoard, columns: [...mockBoard.columns] });
		}),
		deleteColumnFromBoard: vi.fn((params) => {
			mockDeleteColumn(params);
			return Promise.resolve();
		}),
		updateColumnInBoard: vi.fn((params) => {
			mockUpdateColumn(params);
			return Promise.resolve({ ...mockBoard, columns: [...mockBoard.columns] });
		}),
	};
});

vi.mock("react-router-dom", async () => ({
	...(await vi.importActual("react-router-dom")),
	useParams: () => ({ id: "board-1" }),
	useNavigate: () => vi.fn(),
}));

describe("Column Management Flow", () => {
	beforeEach(() => vi.clearAllMocks());
	afterEach(cleanup);

	const getOptionsMenuButtons = () => {
		return screen
			.getAllByRole("button")
			.filter((button) => button.getAttribute("aria-haspopup") === "true");
	};

	const openBoardOptions = async (user: ReturnType<typeof userEvent.setup>) => {
		await user.click(getOptionsMenuButtons()[0]);
	};

	const openColumnOptions = async (
		user: ReturnType<typeof userEvent.setup>,
		index: number,
	) => {
		await user.click(getOptionsMenuButtons()[index]);
	};

	it("adds a new column via AddColumnDialogue", async () => {
		const user = userEvent.setup();
		renderWithProviders(<BoardPage />);

		await waitFor(() =>
			expect(
				screen.getByRole("heading", { name: "Test Board", level: 4 }),
			).toBeDefined(),
		);

		await openBoardOptions(user);
		await user.click(await screen.findByText("Add Column"));

		const titleInput = screen.getByLabelText(/New Column Title/i);
		await user.type(titleInput, "Testing");
		await user.click(screen.getByRole("button", { name: /^Add$/i }));

		await waitFor(() =>
			expect(mockAddColumn).toHaveBeenCalledWith({
				boardId: "board-1",
				columnTitle: "Testing",
			}),
		);
	});

	it("cancels adding a column when Discard is clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<BoardPage />);

		await waitFor(() =>
			expect(
				screen.getByRole("heading", { name: "Test Board", level: 4 }),
			).toBeDefined(),
		);

		await openBoardOptions(user);
		await user.click(await screen.findByText("Add Column"));
		await user.type(screen.getByLabelText(/New Column Title/i), "Testing");
		await user.click(screen.getByRole("button", { name: /Discard/i }));

		expect(mockAddColumn).not.toHaveBeenCalled();
	});

	it("renames a column via ColumnOptionsMenu", async () => {
		const user = userEvent.setup();
		renderWithProviders(<BoardPage />);

		await waitFor(() =>
			expect(screen.getByRole("heading", { name: "To Do" })).toBeDefined(),
		);

		await openColumnOptions(user, 1);
		await user.click(await screen.findByText("Rename Column"));

		const renameInput = screen.getByRole("textbox");
		await user.clear(renameInput);
		await user.type(renameInput, "Backlog");
		await user.click(screen.getByRole("button", { name: /Save/i }));

		await waitFor(() =>
			expect(mockUpdateColumn).toHaveBeenCalledWith({
				boardId: "board-1",
				columnId: "col-1",
				columnData: { title: "Backlog" },
			}),
		);
	});

	it("deletes a column via DeleteColumnDialogue", async () => {
		const user = userEvent.setup();
		renderWithProviders(<BoardPage />);

		await waitFor(() =>
			expect(
				screen.getByRole("heading", { name: "In Progress" }),
			).toBeDefined(),
		);

		await openColumnOptions(user, 2);
		await user.click(await screen.findByText("Delete Column"));

		expect(
			screen.getByText(/This action will also delete all cards/i),
		).toBeDefined();

		await user.click(screen.getByRole("button", { name: /^Delete$/i }));

		await waitFor(() =>
			expect(mockDeleteColumn).toHaveBeenCalledWith({
				boardId: "board-1",
				columnId: "col-2",
			}),
		);
	});

	it("cancels column deletion when Cancel is clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<BoardPage />);

		await waitFor(() =>
			expect(screen.getByRole("heading", { name: "Done" })).toBeDefined(),
		);

		await openColumnOptions(user, 3);
		await user.click(await screen.findByText("Delete Column"));
		await user.click(screen.getByRole("button", { name: /Cancel/i }));

		expect(mockDeleteColumn).not.toHaveBeenCalled();
	});

	it("closes delete dialog when Move Cards First is clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<BoardPage />);

		await waitFor(() =>
			expect(screen.getByRole("heading", { name: "To Do" })).toBeDefined(),
		);

		await openColumnOptions(user, 1);
		await user.click(await screen.findByText("Delete Column"));
		await user.click(screen.getByRole("button", { name: /Move Cards First/i }));

		expect(mockDeleteColumn).not.toHaveBeenCalled();
	});
});
