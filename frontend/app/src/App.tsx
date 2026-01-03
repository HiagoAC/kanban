import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BoardPage } from "./pages/BoardPage";
import { CardPage } from "./pages/CardPage";
import { HomePage } from "./pages/HomePage";
import { NewBoardPage } from "./pages/NewBoardPage";
import { SignInPage } from "./pages/SignInPage";
import { theme } from "./theme";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/sign-in" element={<SignInPage />} />
						<Route path="/boards/:id" element={<BoardPage />} />
						<Route path="/new-board" element={<NewBoardPage />} />
						<Route path="/cards/:id" element={<CardPage />} />
					</Routes>
				</Router>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
