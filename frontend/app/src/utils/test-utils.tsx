import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/contexts/AuthContext";
import { SignInPromptProvider } from "../features/auth/contexts/SignInPromptContext";
import { ActiveBoardProvider } from "../features/board/contexts/ActiveBoardContext";
import { theme } from "../theme";

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

export function renderWithProviders(ui: ReactNode) {
	const queryClient = createTestQueryClient();
	return render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<MemoryRouter>
					<AuthProvider>
						<SignInPromptProvider>
							<ActiveBoardProvider>{ui}</ActiveBoardProvider>
						</SignInPromptProvider>
					</AuthProvider>
				</MemoryRouter>
			</ThemeProvider>
		</QueryClientProvider>,
	);
}
