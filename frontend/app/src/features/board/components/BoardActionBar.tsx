import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { AppBar, Box, IconButton, Typography } from "@mui/material";
import TimeAgo from "react-timeago";
import type { Board } from "../types";
import { BoardOptionsMenu } from "./BoardOptionsMenu";
import { useUpdateBoard } from '../hooks/useUpdateBoard';

interface BoardActionBarProps {
	board: Board;
}

export function BoardActionBar({ board }: BoardActionBarProps) {
	const { mutate: updateBoard } = useUpdateBoard();

	return (
		<AppBar
			position="static"
			sx={{
				height: "auto",
				minHeight: 0,
				m: 0,
				p: 0,
				boxShadow: "none",
				bgcolor: "transparent",
				color: "black",
			}}
		>
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
				<Box
					sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
				>
					<Typography variant="body1" component="div">
						Edited <TimeAgo date={board.updatedAt} />
					</Typography>
					<IconButton onClick={() => updateBoard({ id: board.id, boardData: { starred: !board.starred } })}>
						{board.starred ? <StarIcon sx={{ color: "#FFC107"}} /> : <StarOutlineIcon />}
					</IconButton>
					<BoardOptionsMenu board={board} />
				</Box>
			</Box>
		</AppBar>
	);
}
