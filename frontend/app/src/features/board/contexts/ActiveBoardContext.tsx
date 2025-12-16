import { createContext, type ReactNode, useContext, useState } from "react";

type ActiveBoardContextType = {
	activeBoardId: string | null;
	setActiveBoardId: (id: string | null) => void;
};

const ActiveBoardContext = createContext<ActiveBoardContextType | undefined>(
	undefined,
);

export function ActiveBoardProvider({ children }: { children: ReactNode }) {
	const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

	return (
		<ActiveBoardContext.Provider value={{ activeBoardId, setActiveBoardId }}>
			{children}
		</ActiveBoardContext.Provider>
	);
}

export function useActiveBoard() {
	const context = useContext(ActiveBoardContext);

	if (!context) {
		throw new Error(
			"useActiveBoard must be used within an ActiveBoardProvider",
		);
	}

	return context;
}
