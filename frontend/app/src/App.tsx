import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BoardPage } from "./pages/BoardPage";
import { HomePage } from "./pages/HomePage";
import { NewBoardPage } from "./pages/NewBoardPage";

export function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/board/:id" element={<BoardPage />} />
				<Route path="/new-board" element={<NewBoardPage />} />
			</Routes>
		</Router>
	);
}
