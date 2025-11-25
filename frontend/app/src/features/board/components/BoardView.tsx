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
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{
					width: "100%",
					height: "auto",
					boxSizing: "border-box",
					pl: 2,
					py: 1,
				}}
			>
				<Typography
					variant="h4"
					fontWeight="bold"
					sx={{ flex: 1, minWidth: 0, alignSelf: "end" }}
				>
					{board?.title}
				</Typography>
				<Box sx={{ flexShrink: 0 }}>
					{board && <BoardActionBar board={board} />}
				</Box>
			</Stack>
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
					<ColumnView key={column.id} column={column} boardId={board.id}/>
				))}
			</Stack>
		</Box>
	);
}
