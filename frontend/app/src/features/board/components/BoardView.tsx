import { Box, Stack, Typography } from "@mui/material";
import { useGetBoard } from "../hooks/useGetBoard";
import { BoardActionBar } from "./BoardActionBar";
import { ColumnView } from "./ColumnView";

export function BoardView({ id }: { id: string }) {
	const { data: board, isLoading } = useGetBoard(id);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100%",
			}}
		>
			{board && <BoardActionBar board={board} />}
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					width: "100%",
					height: "auto",
					boxSizing: "border-box",
					py: 2,
				}}
			>
				<Typography variant="h2" fontWeight="bold" mb={2}>
					{board?.title}
				</Typography>
			</Box>
			<Stack
				direction="row"
				sx={{
					overflow: "auto",
					flexGrow: 1,
					minWidth: "100%",
					boxSizing: "border-box",
					p: 2,
				}}
			>
				{board?.columns.map((column) => (
					<ColumnView key={column.id} column={column} />
				))}
			</Stack>
		</Box>
	);
}
