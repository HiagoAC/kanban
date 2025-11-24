import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useDeleteBoard } from "../hooks/useDeleteBoard";
import type { Board } from "../types";

interface DeleteBoardDialogueProps {
	open: boolean;
	onClose: () => void;
	board: Board;
}

export function DeleteBoardDialogue({
	open,
	onClose,
	board,
}: DeleteBoardDialogueProps) {
	const { mutate: deleteBoard } = useDeleteBoard();

	const handleDelete = () => {
		deleteBoard(board.id);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Delete {board.title}</DialogTitle>
			<DialogContent>
				Are you sure you want to delete this board? This action cannot be
				undone.
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleDelete} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
