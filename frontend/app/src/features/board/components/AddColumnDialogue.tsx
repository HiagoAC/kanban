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
import { useAddColumnToBoard } from "../hooks/useAddColumnToBoard";
import type { Board } from "../types";

interface AddColumnDialogueProps {
	open: boolean;
	onClose: () => void;
	board: Board;
}

export function AddColumnDialogue({
	open,
	onClose,
	board,
}: AddColumnDialogueProps) {
	const formId = useId();
	const titleFieldId = useId();
	const [title, setTitle] = useState<string>("");
	const { mutate: addColumn } = useAddColumnToBoard();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		addColumn({ boardId: board.id, columnTitle: title });
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Add Column to {board.title}</DialogTitle>
			<DialogContent>
				<Box component="form" onSubmit={handleSubmit} id={formId}>
					<TextField
						autoFocus
						required
						id={titleFieldId}
						name="title"
						label="New Column Title"
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
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}
