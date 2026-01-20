import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveBoard } from "../contexts/ActiveBoardContext";
import { useGetLatestBoard } from "../hooks/useGetLatestBoard";
import { BoardView } from "./BoardView";

export function LatestBoard() {
	const { data: board, isLoading, error } = useGetLatestBoard();
	const { setActiveBoardId } = useActiveBoard();
	const navigate = useNavigate();

	useEffect(() => {
		if (board) {
			setActiveBoardId(board.id);
		}
	}, [board, setActiveBoardId]);

	useEffect(() => {
		if (!isLoading && !board) {
			navigate("/new-board");
		}
	}, [isLoading, board, navigate]);

	if (isLoading) {
		return <div>Loading latest board...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	if (!board) {
		return null;
	}

	return <BoardView board={board} />;
}
