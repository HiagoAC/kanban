import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SignInPromptProps {
	open: boolean;
	handleClose: () => void;
}

export function SignInPrompt({ open, handleClose }: SignInPromptProps) {
	const navigate = useNavigate();
	const action = (
		<>
			<Button color="info" size="small" onClick={() => navigate("/sign-in")}>
				SIGN IN
			</Button>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</>
	);

	return (
		<Snackbar
			open={open}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			autoHideDuration={16000}
			onClose={handleClose}
			message="Don't lose your work! Sign in to save your boards and cards."
			action={action}
		/>
	);
}
