// @vitest-environment jsdom

import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../../services/apiClient";
import { renderWithProviders } from "../../../utils/test-utils";
import { SideBarBoardList } from "../components/SideBarBoardList";
import { useFetchBoards } from "../hooks/useFetchBoards";

vi.mock("../hooks/useFetchBoards");
vi.mock("../../../services/apiClient", () => ({
	default: {
		get: vi.fn(),
	},
	BASE_URL: "http://localhost:8000",
}));

// Set up API mocks
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

describe("SideBarBoardList", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});
	afterEach(() => {
		vi.resetAllMocks();
	});

	it("displays boards when data is loaded", () => {
		const mockBoards = [
			{ id: "1", title: "Board 1" },
			{ id: "2", title: "Board 2" },
			{ id: "3", title: "Board 3" },
		];

		vi.mocked(useFetchBoards).mockReturnValue({
			data: mockBoards,
			isLoading: false,
			isError: false,
		} as unknown as ReturnType<typeof useFetchBoards>);

		renderWithProviders(<SideBarBoardList />);

		expect(screen.getByText("Board 1")).not.toBeNull();
		expect(screen.getByText("Board 2")).not.toBeNull();
		expect(screen.getByText("Board 3")).not.toBeNull();
		expect(screen.queryByTestId("loading")).toBeNull();
		expect(screen.queryByTestId("error")).toBeNull();
	});

	it("displays loading div when isLoading is true", () => {
		vi.mocked(useFetchBoards).mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		} as unknown as ReturnType<typeof useFetchBoards>);

		renderWithProviders(<SideBarBoardList />);

		expect(screen.getByTestId("loading")).not.toBeNull();
	});

	it("displays error div when isError is true", () => {
		vi.mocked(useFetchBoards).mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
		} as unknown as ReturnType<typeof useFetchBoards>);

		renderWithProviders(<SideBarBoardList />);

		expect(screen.getByTestId("error")).not.toBeNull();
	});
});
