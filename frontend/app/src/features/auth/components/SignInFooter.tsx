import { Box, Typography } from "@mui/material";

export function SignInFooter() {
	return (
		<Box sx={{ mt: 4, textAlign: "center" }}>
			<Typography variant="body2" color="text.secondary">
				By signing in, you agree to our Terms of Service and Privacy Policy
			</Typography>
		</Box>
	);
}
