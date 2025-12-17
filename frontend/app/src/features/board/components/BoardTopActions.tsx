import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Box, IconButton, Typography } from "@mui/material";
import TimeAgo from "react-timeago";
import { useUpdateBoard } from "../hooks/useUpdateBoard";
import type { Board } from "../types";
import { BoardOptionsMenu } from "./BoardOptionsMenu";

interface BoardTopActionsProps {
	board: Board;
}

export function BoardTopActions({ board }: BoardTopActionsProps) {
	const { mutate: updateBoard } = useUpdateBoard();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				height: "auto",
				minHeight: 0,
				p: 1,
				m: 0,
			}}
		>
			<Box sx={{ flexGrow: 1 }} />
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<Typography variant="body1" component="div">
					Edited <TimeAgo date={board.updatedAt} />
				</Typography>
				<IconButton
					onClick={() =>
						updateBoard({
							id: board.id,
							boardData: { starred: !board.starred },
						})
					}
				>
					{board.starred ? (
						<StarIcon sx={{ color: "#FFC107" }} />
					) : (
						<StarOutlineIcon />
					)}
				</IconButton>
				<BoardOptionsMenu board={board} />
			</Box>
		</Box>
	);
}
