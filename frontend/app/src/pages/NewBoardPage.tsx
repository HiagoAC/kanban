import { Box } from "@mui/material";
import { Layout } from "../components/Layout";
import { CreateBoardForm } from "../features/board/components/CreateBoardForm";

export function NewBoardPage() {
	return (
		<Layout>
			<Box p={4}>
				<CreateBoardForm />
			</Box>
		</Layout>
	);
}
