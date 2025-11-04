import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BoardPage } from "./pages/BoardPage";
import { HomePage } from "./pages/HomePage";
import { NewBoardPage } from "./pages/NewBoardPage";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/boards/:id" element={<BoardPage />} />
					<Route path="/new-board" element={<NewBoardPage />} />
				</Routes>
			</Router>
		</QueryClientProvider>
	);
}
