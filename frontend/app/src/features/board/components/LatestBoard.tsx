import { useGetLatestBoard } from "../hooks/useGetLatestBoard";
import { BoardView } from "./BoardView";

export function LatestBoard() {
	const { data: board, isLoading, error } = useGetLatestBoard();

	if (isLoading) {
		return <div>Loading latest board...</div>;
	}

	if (error) {
		return <div>Error loading board</div>;
	}

	if (!board) {
		return <div>No boards found. Create your first board!</div>;
	}

	return <BoardView board={board} />;
}
