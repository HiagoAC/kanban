// @vitest-environment jsdom

import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../services/apiClient";
import { renderWithProviders } from "../../utils/test-utils";
import { SideBarButtonList } from "../SideBarButtonList";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockRefreshUser = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("../../features/auth/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("../../features/auth/components/UserInfo", () => ({
	UserInfo: () => <div data-testid="user-info">User Info</div>,
}));

vi.mock("../../services/apiClient", () => ({
	default: {
		get: vi.fn(),
	},
	BASE_URL: "http://localhost:8000",
}));

import { useAuth } from "../../features/auth/hooks/useAuth";

describe("SideBarButtonList", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(apiClient.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: {},
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		cleanup();
	});
	it("renders sign out button for authenticated non-guest user", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: "1", email: "test@test.com", isGuest: false },
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			refreshUser: mockRefreshUser,
		});

		renderWithProviders(<SideBarButtonList />);

		expect(screen.getAllByText("Sign Out").length).toBeGreaterThan(0);
		expect(screen.getByTestId("user-info")).not.toBeNull();
	});

	it("renders sign in button for unauthenticated user", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: undefined,
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			refreshUser: mockRefreshUser,
		});

		renderWithProviders(<SideBarButtonList />);

		expect(screen.getAllByText("Sign In").length).toBeGreaterThan(0);
		expect(screen.queryByTestId("user-info")).toBeNull();
	});

	it("calls logout and navigates on sign out click", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: { id: "1", email: "test@test.com", isGuest: false },
			isAuthenticated: true,
			isLoading: false,
			logout: mockLogout,
			refreshUser: mockRefreshUser,
		});

		renderWithProviders(<SideBarButtonList />);

		const buttons = screen.getAllByText("Sign Out");
		await userEvent.click(buttons[0]);

		expect(mockLogout).toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
	});

	it("navigates to sign in when sign in button clicked", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: undefined,
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			refreshUser: mockRefreshUser,
		});

		renderWithProviders(<SideBarButtonList />);

		const buttons = screen.getAllByText("Sign In");
		await userEvent.click(buttons[0]);

		expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
	});

	it("navigates to new board when create board button clicked", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: undefined,
			isAuthenticated: false,
			isLoading: false,
			logout: mockLogout,
			refreshUser: mockRefreshUser,
		});

		renderWithProviders(<SideBarButtonList />);

		const buttons = screen.getAllByText("Create Board");
		await userEvent.click(buttons[0]);

		expect(mockNavigate).toHaveBeenCalledWith("/new-board");
	});
});
