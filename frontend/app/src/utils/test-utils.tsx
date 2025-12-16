import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { ActiveBoardProvider } from "../features/board/contexts/ActiveBoardContext";

export function renderWithProviders(ui: ReactNode) {
	return render(
		<MemoryRouter>
			<ActiveBoardProvider>{ui}</ActiveBoardProvider>
		</MemoryRouter>,
	);
}
