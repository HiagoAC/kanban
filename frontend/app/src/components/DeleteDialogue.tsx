import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";

interface DeleteDialogueProps {
	open: boolean;
	onClose: () => void;
	dialogueTitle: string;
	onDelete: () => void;
	content?: string;
	deleteButtonText?: string;
	cancelButtonText?: string;
}

export function DeleteDialogue({
	open,
	onClose,
	dialogueTitle,
	onDelete,
	content = "Are you sure you want to delete this item? This action cannot be undone.",
	deleteButtonText = "Delete",
	cancelButtonText = "Cancel",
}: DeleteDialogueProps) {
	const handleDelete = () => {
		onDelete();
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{dialogueTitle}</DialogTitle>
			<DialogContent>{content}</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{cancelButtonText}</Button>
				<Button onClick={handleDelete} color="error">
					{deleteButtonText}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
