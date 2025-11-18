import { Box, Stack, Typography } from "@mui/material";
import { useGetBoard } from "../hooks/useGetBoard";
import { BoardActionBar } from "./BoardActionBar";

export function BoardView({ id }: { id: string }) {
	const { data: board, isLoading } = useGetBoard(id);

	console.log("Board data:", board);
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
					<Box
						key={column.id}
						sx={{
							border: "2px solid black",
							borderRadius: 2,
							minWidth: 250,
							alignSelf: "stretch",
							p: 2,
							mr: 2,
						}}
					>
						<Typography variant="h4" fontWeight="bold" mb={1}>
							{column.title}
						</Typography>
					</Box>
				))}
			</Stack>
		</Box>
	);
}
