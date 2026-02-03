// @vitest-environment happy-dom

import GoogleIcon from "@mui/icons-material/Google";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GuestUserActionDialog } from "../features/auth/components/GuestUserActionDialog";
import { SignInButton } from "../features/auth/components/SignInButton";
import { SignInFooter } from "../features/auth/components/SignInFooter";
import {
	AuthContext,
	AuthProvider,
} from "../features/auth/contexts/AuthContext";
import type { User } from "../features/auth/types";
import { SignInPage } from "../pages/SignInPage";
import { theme } from "../theme";

const mockSignInWithGoogle = vi.fn();
const mockGetMe = vi.fn();
const mockGetCSRFToken = vi.fn();
const mockLogout = vi.fn();

// biome-ignore lint/suspicious/noExplicitAny: test setup requires mocking window.location
delete (window as any).location;
// biome-ignore lint/suspicious/noExplicitAny: test setup requires mocking window.location
window.location = { assign: vi.fn() } as any;

vi.mock("../features/auth/services", () => ({
	signInWithGoogle: (guestAction?: string) => mockSignInWithGoogle(guestAction),
	getMe: () => mockGetMe(),
	getCSRFToken: () => mockGetCSRFToken(),
	logout: () => mockLogout(),
	setGuestActionSessionOnSignIn: vi.fn(),
}));

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

function renderWithAuth(ui: React.ReactNode, user?: User) {
	const queryClient = createTestQueryClient();
	if (user) mockGetMe.mockResolvedValue(user);

	return render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<MemoryRouter>
					<AuthProvider>{ui}</AuthProvider>
				</MemoryRouter>
			</ThemeProvider>
		</QueryClientProvider>,
	);
}

describe("Authentication Flow Integration Tests", () => {
	const guestUser: User = {
		id: "guest-1",
		username: "guest",
		email: "guest@example.com",
		firstName: "Guest",
		lastName: "User",
		isGuest: true,
	};

	const authenticatedUser: User = {
		id: "user-1",
		username: "johndoe",
		email: "john@example.com",
		firstName: "John",
		lastName: "Doe",
		isGuest: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockGetCSRFToken.mockResolvedValue(undefined);
	});

	afterEach(cleanup);

	describe("Sign-In Page", () => {
		it("renders complete sign-in page with all elements", () => {
			mockGetMe.mockRejectedValue(new Error("Not authenticated"));
			renderWithAuth(<SignInPage />);

			expect(screen.getByText("Welcome to Kanban")).not.toBeNull();
			expect(
				screen.getByRole("button", { name: /continue with google/i }),
			).not.toBeNull();
			expect(
				screen.getByText(/by signing in, you agree to our terms of service/i),
			).not.toBeNull();
			expect(
				screen.getByText("We'll create an account if you don't have one."),
			).not.toBeNull();
		});

		it("fetches CSRF token on mount", async () => {
			mockGetMe.mockRejectedValue(new Error("Not authenticated"));
			renderWithAuth(<SignInPage />);

			await waitFor(() => expect(mockGetCSRFToken).toHaveBeenCalled());
		});
	});

	describe("Sign-In Button", () => {
		it("renders with icon and triggers onClick", async () => {
			const user = userEvent.setup();
			const mockOnClick = vi.fn();

			render(
				<SignInButton
					serviceName="Google"
					onClick={mockOnClick}
					icon={<GoogleIcon data-testid="google-icon" />}
				/>,
			);

			expect(screen.getByTestId("google-icon")).not.toBeNull();
			await user.click(screen.getByRole("button"));
			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it("shows loading state and disables button", () => {
			render(
				<SignInButton
					serviceName="Google"
					onClick={vi.fn()}
					icon={<GoogleIcon />}
					isLoading={true}
				/>,
			);

			const button = screen.getByRole("button") as HTMLButtonElement;
			expect(button.disabled).toBe(true);
			expect(screen.getByText(/signing in.../i)).not.toBeNull();
		});
	});

	describe("Guest Action Dialog", () => {
		it("shows/hides dialog and triggers action callbacks", async () => {
			const user = userEvent.setup();
			const mockSetAction = vi.fn();
			const mockOnClose = vi.fn();

			const { rerender } = render(
				<GuestUserActionDialog
					open={false}
					onClose={mockOnClose}
					setAction={mockSetAction}
				/>,
			);

			expect(screen.queryByText("Save Your Work?")).toBeNull();

			rerender(
				<GuestUserActionDialog
					open={true}
					onClose={mockOnClose}
					setAction={mockSetAction}
				/>,
			);
			expect(screen.getByText("Save Your Work?")).not.toBeNull();

			await user.click(screen.getByRole("button", { name: /^save$/i }));
			expect(mockSetAction).toHaveBeenCalledWith("merge");
			expect(mockOnClose).toHaveBeenCalled();

			mockSetAction.mockClear();
			mockOnClose.mockClear();

			rerender(
				<GuestUserActionDialog
					open={true}
					onClose={mockOnClose}
					setAction={mockSetAction}
				/>,
			);
			await user.click(screen.getByRole("button", { name: /discard/i }));
			expect(mockSetAction).toHaveBeenCalledWith("discard");
			expect(mockOnClose).toHaveBeenCalled();
		});
	});

	describe("Sign-In Footer", () => {
		it("renders terms and privacy policy text", () => {
			render(<SignInFooter />);
			expect(
				screen.getByText(
					/by signing in, you agree to our terms of service and privacy policy/i,
				),
			).not.toBeNull();
		});
	});

	describe("Guest User Flow", () => {
		it("opens dialog on click and completes merge flow", async () => {
			const user = userEvent.setup();
			renderWithAuth(<SignInPage />, guestUser);

			await waitFor(() =>
				screen.getByRole("button", { name: /continue with google/i }),
			);

			await user.click(
				screen.getByRole("button", { name: /continue with google/i }),
			);
			expect(screen.getByText("Save Your Work?")).not.toBeNull();
			expect(mockSignInWithGoogle).not.toHaveBeenCalled();

			await user.click(screen.getByRole("button", { name: /^save$/i }));
			await waitFor(() =>
				expect(mockSignInWithGoogle).toHaveBeenCalledWith("merge"),
			);
		});

		it("completes discard flow when Discard is clicked", async () => {
			const user = userEvent.setup();
			renderWithAuth(<SignInPage />, guestUser);

			await waitFor(() =>
				screen.getByRole("button", { name: /continue with google/i }),
			);
			await user.click(
				screen.getByRole("button", { name: /continue with google/i }),
			);
			await user.click(screen.getByRole("button", { name: /discard/i }));

			await waitFor(() =>
				expect(mockSignInWithGoogle).toHaveBeenCalledWith("discard"),
			);
		});

		it("closes dialog without signing in on Escape", async () => {
			const user = userEvent.setup();
			renderWithAuth(<SignInPage />, guestUser);

			await waitFor(() =>
				screen.getByRole("button", { name: /continue with google/i }),
			);
			await user.click(
				screen.getByRole("button", { name: /continue with google/i }),
			);

			expect(screen.getByText("Save Your Work?")).not.toBeNull();
			await user.keyboard("{Escape}");

			await waitFor(() =>
				expect(screen.queryByText("Save Your Work?")).toBeNull(),
			);
			expect(mockSignInWithGoogle).not.toHaveBeenCalled();
		});
	});

	describe("Authenticated User Flow", () => {
		it("signs in directly without showing dialog", async () => {
			const user = userEvent.setup();
			renderWithAuth(<SignInPage />, authenticatedUser);

			await waitFor(() =>
				screen.getByRole("button", { name: /continue with google/i }),
			);
			await user.click(
				screen.getByRole("button", { name: /continue with google/i }),
			);

			await waitFor(() =>
				expect(mockSignInWithGoogle).toHaveBeenCalledWith(undefined),
			);
			expect(screen.queryByText("Save Your Work?")).toBeNull();
		});
	});

	describe("AuthContext Logout", () => {
		it("handles successful logout and clears query cache", async () => {
			const queryClient = createTestQueryClient();
			const clearSpy = vi.spyOn(queryClient, "clear");
			mockLogout.mockResolvedValue(undefined);

			const TestComponent = () => {
				const { logout: contextLogout } = React.useContext(AuthContext);
				return (
					<button onClick={() => contextLogout()} type="button">
						Logout
					</button>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<MemoryRouter>
							<AuthProvider>
								<TestComponent />
							</AuthProvider>
						</MemoryRouter>
					</ThemeProvider>
				</QueryClientProvider>,
			);

			await waitFor(() => screen.getByRole("button", { name: /logout/i }));
			const user = userEvent.setup();
			await user.click(screen.getByRole("button", { name: /logout/i }));

			await waitFor(() => expect(mockLogout).toHaveBeenCalled());
			expect(clearSpy).toHaveBeenCalled();
		});

		it("handles logout error and still clears query cache", async () => {
			const queryClient = createTestQueryClient();
			const clearSpy = vi.spyOn(queryClient, "clear");
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});
			mockLogout.mockRejectedValue(new Error("Logout failed"));

			const TestComponent = () => {
				const { logout: contextLogout } = React.useContext(AuthContext);
				return (
					<button onClick={() => contextLogout()} type="button">
						Logout
					</button>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<MemoryRouter>
							<AuthProvider>
								<TestComponent />
							</AuthProvider>
						</MemoryRouter>
					</ThemeProvider>
				</QueryClientProvider>,
			);

			await waitFor(() => screen.getByRole("button", { name: /logout/i }));
			const user = userEvent.setup();
			await user.click(screen.getByRole("button", { name: /logout/i }));

			await waitFor(() => expect(mockLogout).toHaveBeenCalled());
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Logout failed:",
				expect.any(Error),
			);
			expect(clearSpy).toHaveBeenCalled();

			consoleErrorSpy.mockRestore();
		});
	});

	describe("AuthContext RefreshUser", () => {
		it("invalidates user query when refreshUser is called", async () => {
			const queryClient = createTestQueryClient();
			const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

			const TestComponent = () => {
				const { refreshUser } = React.useContext(AuthContext);
				return (
					<button onClick={() => refreshUser()} type="button">
						Refresh
					</button>
				);
			};

			render(
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<MemoryRouter>
							<AuthProvider>
								<TestComponent />
							</AuthProvider>
						</MemoryRouter>
					</ThemeProvider>
				</QueryClientProvider>,
			);

			await waitFor(() => screen.getByRole("button", { name: /refresh/i }));
			const user = userEvent.setup();
			await user.click(screen.getByRole("button", { name: /refresh/i }));

			await waitFor(() =>
				expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["me"] }),
			);
		});
	});
});
