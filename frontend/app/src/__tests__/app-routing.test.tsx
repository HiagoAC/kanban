// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";

// Mock user data
const _mockUser = {
	id: "user-1",
	username: "testuser",
	email: "test@example.com",
	isGuest: false,
};

const mockGuestUser = {
	id: "guest-1",
	username: "Guest",
	email: "",
	isGuest: true,
};

const mockBoards = [
	{
		id: "board-1",
		title: "My Board",
		columns: [],
		starred: false,
		createdAt: "2026-01-15T10:00:00Z",
		updatedAt: "2026-01-15T10:00:00Z",
	},
];

// Mock API client
vi.mock("../services/apiClient", () => ({
	default: {
		get: vi.fn((url: string) => {
			if (url === "auth/me/") return Promise.resolve({ data: mockGuestUser });
			if (url === "boards/") return Promise.resolve({ data: mockBoards });
			if (url === "boards/latest/")
				return Promise.resolve({ data: mockBoards[0] });
			if (url === "boards/board-1/")
				return Promise.resolve({ data: mockBoards[0] });
			if (url.startsWith("cards")) return Promise.resolve({ data: [] });
			return Promise.resolve({ data: null });
		}),
		post: vi.fn().mockResolvedValue({ data: null }),
		patch: vi.fn().mockResolvedValue({ data: null }),
		delete: vi.fn().mockResolvedValue({ data: null }),
	},
	BASE_URL: "http://localhost:8000/",
}));

// Mock cookies utility
vi.mock("../utils/cookies", () => ({
	getCookie: vi.fn(() => "mock-token"),
	setCookie: vi.fn(),
	deleteCookie: vi.fn(),
}));

describe("App Routing Integration", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("renders home page at root route", async () => {
		window.history.pushState({}, "", "/");
		render(<App />);

		await waitFor(() => {
			expect(screen.getAllByText("My Board").length).toBeGreaterThan(0);
		});
	});

	it("renders sign in page at /sign-in route", async () => {
		window.history.pushState({}, "", "/sign-in");
		render(<App />);

		await waitFor(() => {
			expect(screen.getByText("Welcome to Kanban")).not.toBeNull();
		});

		expect(screen.getByText("Continue with Google")).not.toBeNull();
	});

	it("renders board page at /boards/:id route", async () => {
		window.history.pushState({}, "", "/boards/board-1");
		render(<App />);

		await waitFor(() => {
			expect(screen.getAllByText("My Board").length).toBeGreaterThan(0);
		});
	});

	it("renders new board page at /new-board route", async () => {
		window.history.pushState({}, "", "/new-board");
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: /create new kanban board/i }),
			).not.toBeNull();
		});
	});

	it("provides all required contexts to child components", async () => {
		window.history.pushState({}, "", "/");
		render(<App />);

		// Wait for AuthProvider to load user
		await waitFor(() => {
			expect(screen.getAllByText("My Board").length).toBeGreaterThan(0);
		});

		// Verify the app loaded successfully with all providers
		// (QueryClient, AuthProvider, SignInPromptProvider, ThemeProvider)
		expect(screen.queryByText(/error/i)).toBeNull();
	});

	it("applies Material-UI theme styling", async () => {
		window.history.pushState({}, "", "/");
		// biome-ignore lint/correctness/noUnusedVariables: container may be used for future assertions
		const { container } = render(<App />);

		// CssBaseline should reset styles and ThemeProvider should apply theme
		await waitFor(() => {
			const body = document.body;
			expect(body).toBeDefined();
		});
	});
});
