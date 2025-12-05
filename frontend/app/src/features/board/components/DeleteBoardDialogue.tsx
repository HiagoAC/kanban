import { DeleteDialogue } from "../../../components/DeleteDialogue";
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
		<DeleteDialogue
			open={open}
			onClose={onClose}
			dialogueTitle="Delete Board"
			onDelete={handleDelete}
			content={`Are you sure you want to delete the board "${board.title}"? 
				This action cannot be undone.`}
			deleteButtonText="Delete Board"
			cancelButtonText="Cancel"
		/>
	);
}
