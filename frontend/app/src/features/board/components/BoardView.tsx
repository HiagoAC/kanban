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
				height: "100vh",
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 100,
					backgroundColor: "background.default",
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
				className="auto-hide-scrollbar"
				direction="row"
				sx={{
					overflow: "auto",
					flex: 1,
					minWidth: "100%",
					boxSizing: "border-box",
					p: 2,
				}}
			>
				{board?.columns.map((column, index) => (
					<ColumnView
						key={column.id}
						column={column}
						board={board}
						prevColumnId={index > 0 ? board.columns[index - 1].id : undefined}
						nextColumnId={
							index < board.columns.length - 1
								? board.columns[index + 1].id
								: undefined
						}
					/>
				))}
			</Stack>
		</Box>
	);
}
