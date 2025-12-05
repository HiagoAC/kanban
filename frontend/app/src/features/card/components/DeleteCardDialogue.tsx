import { DeleteDialogue } from "../../../components/DeleteDialogue";
import type { Card } from "../types";

interface DeleteCardDialogueProps {
	open: boolean;
	onClose: () => void;
	cardData: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>;
	handleDelete: () => void;
}

export function DeleteCardDialogue({
	open,
	onClose,
	cardData,
	handleDelete,
}: DeleteCardDialogueProps) {
	return (
		<DeleteDialogue
			open={open}
			onClose={onClose}
			dialogueTitle="Delete Card"
			onDelete={handleDelete}
			content={`Are you sure you want to delete the card "${cardData.title}"? 
				This action cannot be undone.`}
			deleteButtonText="Delete Card"
			cancelButtonText="Cancel"
		/>
	);
}
