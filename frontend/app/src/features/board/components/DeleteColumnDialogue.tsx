import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useDeleteColumnFromBoard } from "../hooks/useDeleteColumnFromBoard";
import type { Board, Column } from "../types";

interface DeleteColumnDialogueProps {
	open: boolean;
	onClose: () => void;
	board: Board;
	column: Column;
}

export function DeleteColumnDialogue({
	open,
	onClose,
	board,
	column,
}: DeleteColumnDialogueProps) {
	const { mutate: deleteColumn } = useDeleteColumnFromBoard();

	const handleDelete = () => {
		deleteColumn({ boardId: board.id, columnId: column.id });
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				Delete Column '{column.title}' from {board.title}
			</DialogTitle>
			<DialogContent>
				Are you sure you want to delete this column? This action will also
				delete all cards within this column and cannot be undone.
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onClose}>Move Cards First</Button>
				<Button onClick={handleDelete} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
