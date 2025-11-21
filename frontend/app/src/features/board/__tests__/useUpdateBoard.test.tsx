// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { useUpdateBoard } from "../hooks/useUpdateBoard";
import type { Board, BoardListItem } from "../types";

vi.mock("../services", () => ({
	updateBoard: vi.fn(),
}));

import { updateBoard } from "../services";

describe("useUpdateBoard onSuccess re-rendering", () => {
	it("should update boards list query data when board is updated", async () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});

		const board1: BoardListItem = {
			id: "1",
			title: "A Board",
		};
		const board2: BoardListItem = {
			id: "2",
			title: "Another Board",
		};

		const updatedBoard: Board = {
			id: "1",
			title: "Updated Board",
			createdAt: new Date("2025-12-12"),
			updatedAt: new Date("2025-12-12"),
			columns: [],
		};

		// Set initial query data
		queryClient.setQueryData(["boards"], [board1, board2]);

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		vi.mocked(updateBoard).mockResolvedValue(updatedBoard);

		const { result } = renderHook(() => useUpdateBoard(), { wrapper });

		result.current.mutate({
			id: "1",
			boardData: { title: "Updated Board" },
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const boardsData = queryClient.getQueryData(["boards"]) as BoardListItem[];
		expect(boardsData).toEqual([
			{ id: updatedBoard.id, title: updatedBoard.title },
			board2,
		]);
	});

	it("should update individual board query data when board is updated", async () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});

		const originalBoard: Board = {
			id: "1",
			title: "A Board",
			createdAt: new Date("2025-12-12"),
			updatedAt: new Date("2025-12-12"),
			columns: [],
		};

		const updatedBoard: Board = {
			id: "1",
			title: "Updated Board",
			createdAt: new Date("2025-12-12"),
			updatedAt: new Date("2024-01-02"),
			columns: [],
		};

		queryClient.setQueryData(["board", "1"], originalBoard);

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		vi.mocked(updateBoard).mockResolvedValue(updatedBoard);

		const { result } = renderHook(() => useUpdateBoard(), { wrapper });

		result.current.mutate({
			id: "1",
			boardData: { title: "Updated Board" },
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		const boardData = queryClient.getQueryData(["board", "1"]) as Board;
		expect(boardData).toEqual(updatedBoard);
	});
});
