import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { Board } from "../types";
import { BoardTopActions } from "./BoardTopActions";

interface BoardTopBarProps {
	board: Board;
}

export function BoardTopBar({ board }: BoardTopBarProps) {
	return (
		<Stack
			sx={{
				position: "sticky",
				top: 0,
				zIndex: 100,
				backgroundColor: "background.default",
				width: "100%",
				height: "auto",
				boxSizing: "border-box",
				pl: 2,
				py: { xs: 0.5, md: 1 },
			}}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<IconButton
					sx={{
						mr: 2,
						display: { xs: "flex", md: "none" },
					}}
				>
					<MenuIcon />
				</IconButton>
				<Typography
					variant="h4"
					fontWeight="bold"
					sx={{
						flex: 1,
						minWidth: 0,
						display: { xs: "none", md: "block" },
					}}
				>
					{board.title}
				</Typography>
				<Box sx={{ flexShrink: 0 }}>
					<BoardTopActions board={board} />
				</Box>
			</Stack>
			{/* Mobile Title */}
			<Typography
				variant="h6"
				fontWeight="bold"
				sx={{
					pl: 1,
					wordBreak: "break-word",
					display: { xs: "block", md: "none" },
				}}
			>
				{board.title}
			</Typography>
		</Stack>
	);
}
