import { Box, Container } from "@mui/material";
import { SignInFooter } from "../features/auth/components/SignInFooter";
import { SignInView } from "../features/auth/components/SignInView";
import { backgroundSecondary } from "../theme";

export function SignInPage() {
	return (
		<Box sx={{ minHeight: "100vh", backgroundColor: backgroundSecondary }}>
			<Container maxWidth="sm" sx={{ minHeight: "100vh", py: 8 }}>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					minHeight="80vh"
				>
					<SignInView />
					<SignInFooter />
				</Box>
			</Container>
		</Box>
	);
}
