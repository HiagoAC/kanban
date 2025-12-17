import { Box, Stack, Typography } from "@mui/material";
import type { Board } from "../types";
import { BoardTopActions } from "./BoardTopActions";

interface BoardTopBarProps {
	board: Board;
}

export function BoardTopBar({ board }: BoardTopBarProps) {
	return (
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
				{board.title}
			</Typography>
			<Box sx={{ flexShrink: 0 }}>
				<BoardTopActions board={board} />
			</Box>
		</Stack>
	);
}
