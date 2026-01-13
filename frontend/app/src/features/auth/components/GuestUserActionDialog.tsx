import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import type { GuestAction } from "../types";

interface GuestUserActionDialogProps {
	open: boolean;
	onClose: () => void;
	setAction: (action: GuestAction) => void;
}

export function GuestUserActionDialog({
	open,
	onClose,
	setAction,
}: GuestUserActionDialogProps) {
	const handleSave = () => {
		setAction("merge");
		onClose();
	};

	const handleDiscard = () => {
		setAction("discard");
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Save Your Work?</DialogTitle>
			<DialogContent>
				Would you like to keep the boards you created before signing in? If not,
				they will be discarded when you sign in.
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDiscard}>Discard</Button>
				<Button onClick={handleSave} variant="contained">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
