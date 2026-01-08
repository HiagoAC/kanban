import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CreateBoardForm } from "../features/board/components/CreateBoardForm";

export function NewBoardPage() {
	const navigate = useNavigate();

	return (
		<Layout>
			<Stack direction="column">
				<IconButton
					onClick={() => navigate("/")}
					sx={{
						ml: 2,
						mr: "auto",
						display: { xs: "flex", md: "none" },
					}}
				>
					<MenuIcon />
				</IconButton>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "flex-start",
						minHeight: "100vh",
						gap: 4,
						textAlign: "center",
						px: 4,
						pt: 6,
					}}
				>
					<Typography variant="h3" fontWeight="bold">
						Create New Kanban Board
					</Typography>
					<Paper
						elevation={3}
						sx={{
							p: 4,
							width: "100%",
							maxWidth: 600,
							borderRadius: 2,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<CreateBoardForm />
					</Paper>
				</Box>
			</Stack>
		</Layout>
	);
}
