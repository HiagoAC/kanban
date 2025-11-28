import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
} from "@mui/material";
import { useId, useState } from "react";
import type { Board, Column } from "../../board/types";
import { useCreateCard } from "../hooks/useCreateCard";
import type { Priority } from "../types";
import { PRIORITY_OPTIONS } from "../types";

interface CreateCardDialogueProps {
	open: boolean;
	onClose: () => void;
	column: Column;
	board: Board;
}

export function CreateCardDialogue({
	open,
	onClose,
	column,
	board,
}: CreateCardDialogueProps) {
	const [title, setTitle] = useState<string>("");
	const [priority, setPriority] = useState<Priority | null>("medium");
	const [body, setBody] = useState<string | null>(null);

	const formId = useId();
	const titleFieldId = useId();
	const bodyFieldId = useId();

	const { mutate: createCard } = useCreateCard();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createCard({
			columnId: column.id,
			title,
			body,
			priority,
		});
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				Create new card at {column.title} / {board.title}
			</DialogTitle>
			<DialogContent>
				<Box
					id={formId}
					component="form"
					onSubmit={handleSubmit}
					sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
				>
					<TextField
						required
						id={titleFieldId}
						name="title"
						label="Title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<FormControl>
						<FormLabel>Priority Level</FormLabel>
						<RadioGroup
							row
							value={priority}
							onChange={(e) => setPriority(e.target.value as Priority)}
						>
							{PRIORITY_OPTIONS.map((option) => (
								<FormControlLabel
									key={option}
									value={option}
									control={<Radio />}
									label={option}
								/>
							))}
						</RadioGroup>
					</FormControl>

					<TextField
						id={bodyFieldId}
						multiline
						label="Body"
						minRows={4}
						value={body}
						onChange={(e) => setBody(e.target.value)}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Discard</Button>
				<Button type="submit" form={formId}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}
