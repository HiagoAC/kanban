import { useEffect } from "react";
import { useActiveBoard } from "../contexts/ActiveBoardContext";
import { useGetBoard } from "../hooks/useGetBoard";
import { BoardView } from "./BoardView";

export function BoardContainer({ id }: { id: string }) {
	const { data: board, isLoading } = useGetBoard(id);
	const { setActiveBoardId } = useActiveBoard();

	useEffect(() => {
		if (board) {
			setActiveBoardId(board.id);
		}
	}, [board, setActiveBoardId]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!board) {
		return <div>Board not found</div>;
	}

	return <BoardView board={board} />;
}
