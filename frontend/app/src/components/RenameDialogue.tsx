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

interface RenameDialogueProps {
	open: boolean;
	onClose: () => void;
	dialogueTitle: string;
	onSubmit: (newName: string) => void;
	label?: string;
}

export function RenameDialogue({
	open,
	onClose,
	dialogueTitle,
	onSubmit,
	label = "New Title",
}: RenameDialogueProps) {
	const formId = useId();
	const fieldId = useId();
	const [value, setValue] = useState<string>("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(value);
		onClose();
		setValue("");
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{dialogueTitle}</DialogTitle>
			<DialogContent>
				<Box component="form" onSubmit={handleSubmit} id={formId}>
					<TextField
						autoFocus
						required
						id={fieldId}
						label={label}
						type="text"
						fullWidth
						variant="standard"
						value={value}
						onChange={(e) => setValue(e.target.value)}
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
