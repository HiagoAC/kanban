// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	executeDragMove,
	updateItemsOrder,
} from "../../../utils/drag-and-drop";
import { BoardView } from "../components/BoardView";
import type { Board, Column } from "../types";

vi.mock("@dnd-kit/core", async () => {
	const actual =
		await vi.importActual<typeof import("@dnd-kit/core")>("@dnd-kit/core");

	return {
		...actual,
		// biome-ignore lint/suspicious/noExplicitAny: Mocking requires any for simplified test component props
		DndContext: ({ onDragEnd, children }: any) => {
			// Defer onDragEnd to avoid state updates during render
			queueMicrotask(() => {
				onDragEnd?.({
					active: { id: "col-1" },
					over: { id: "col-2" },
				});
			});
			return <div>{children}</div>;
		},
	};
});

vi.mock("../hooks/useMoveColumnBefore", () => ({
	useMoveColumnBefore: () => ({ mutate: vi.fn() }),
}));

vi.mock("../hooks/useMoveColumnEnd", () => ({
	useMoveColumnEnd: () => ({ mutate: vi.fn() }),
}));

vi.mock("../../../utils/drag-and-drop", () => ({
	executeDragMove: vi.fn(),
	updateItemsOrder: vi.fn(),
}));

vi.mock("../components/BoardTopBar", () => ({
	BoardTopBar: ({ board }: { board: Board }) => (
		<div data-testid="board-title">{board.title}</div>
	),
}));

vi.mock("../components/SortableColumn", () => ({
	SortableColumn: ({
		children,
	}: {
		children: (props: {
			dragListeners: Record<string, unknown>;
		}) => React.ReactNode;
	}) => <div>{children({ dragListeners: {} })}</div>,
}));

vi.mock("../components/ColumnView", () => ({
	ColumnView: ({ column }: { column: Column }) => (
		<div data-testid={`column-${column.id}`}>{column.title}</div>
	),
}));

const column = (id: string, title: string): Column => ({ id, title });

const board = (columns: Column[]): Board => ({
	id: "board-1",
	title: "Test Board",
	starred: false,
	columns,
	createdAt: new Date(),
	updatedAt: new Date(),
});

const renderBoard = (b: Board) =>
	render(
		<QueryClientProvider client={new QueryClient()}>
			<BoardView board={b} />
		</QueryClientProvider>,
	);

describe("BoardView", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("renders board title", () => {
		renderBoard(board([column("col-1", "To Do")]));

		expect(screen.getByTestId("board-title")).toBeTruthy();
		expect(screen.getByText("Test Board")).toBeTruthy();
	});

	it("renders all columns", () => {
		renderBoard(
			board([
				column("col-1", "To Do"),
				column("col-2", "In Progress"),
				column("col-3", "Done"),
			]),
		);

		expect(screen.getByTestId("column-col-1")).toBeTruthy();
		expect(screen.getByTestId("column-col-2")).toBeTruthy();
		expect(screen.getByTestId("column-col-3")).toBeTruthy();
	});

	it("renders empty board", () => {
		renderBoard(board([]));

		expect(screen.getByTestId("board-title")).toBeTruthy();
		expect(screen.queryByTestId(/column-/)).toBeNull();
	});

	it("does not update columns when executeDragMove returns false", async () => {
		vi.mocked(executeDragMove).mockReturnValue(false);

		renderBoard(board([column("col-1", "To Do"), column("col-2", "Done")]));

		await waitFor(() => {
			expect(executeDragMove).toHaveBeenCalled();
		});
		expect(updateItemsOrder).not.toHaveBeenCalled();
	});

	it("updates columns order when executeDragMove returns true", async () => {
		vi.mocked(executeDragMove).mockReturnValue(true);
		vi.mocked(updateItemsOrder).mockImplementation((items) => items);

		renderBoard(board([column("col-1", "To Do"), column("col-2", "Done")]));

		await waitFor(() => {
			expect(executeDragMove).toHaveBeenCalled();
		});
		expect(updateItemsOrder).toHaveBeenCalled();
	});
});
