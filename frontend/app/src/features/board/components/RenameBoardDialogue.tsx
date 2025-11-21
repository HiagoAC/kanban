import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { useId, useState } from "react";
import { useUpdateBoard } from "../hooks/useUpdateBoard";

interface RenameBoardDialogueProps {
	open: boolean;
	onClose: () => void;
	boardId: string;
}

export function RenameBoardDialogue({
	open,
	onClose,
	boardId,
}: RenameBoardDialogueProps) {
	const formId = useId();
	const titleFieldId = useId();
	const [title, setTitle] = useState<string>("");
	const { mutate: updateBoard } = useUpdateBoard();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateBoard({ id: boardId, boardData: { title } });
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Rename Board</DialogTitle>
			<DialogContent>
				<Box component="form" onSubmit={handleSubmit} id={formId}>
					<TextField
						autoFocus
						required
						id={titleFieldId}
						name="title"
						label="New Title"
						type="text"
						fullWidth
						variant="standard"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Discard</Button>
				<Button type="submit" form={formId}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
