import GoogleIcon from "@mui/icons-material/Google";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { signInWithGoogle } from "../services";
import { SignInButton } from "./SignInButton";

export function SignInView() {
	return (
		<Card
			elevation={2}
			sx={{
				width: "100%",
				maxWidth: 400,
				borderRadius: 3,
				border: `1px solid`,
				borderColor: "divider",
			}}
		>
			<CardContent sx={{ p: 4 }}>
				<Box textAlign="center" mb={4}>
					<Typography variant="h3" component="h1" gutterBottom>
						Welcome to Kanban
					</Typography>
				</Box>
				<SignInButton
					serviceName="Google"
					onClick={signInWithGoogle}
					icon={<GoogleIcon />}
				/>
				<Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
					<Typography
						variant="caption"
						color="text.secondary"
						display="block"
						textAlign="center"
						mb={1}
					>
						We'll create an account if you don't have one.
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
}
