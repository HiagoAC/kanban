import { StarBorderOutlined as StarBorderOutlinedIcon } from "@mui/icons-material";
import { AppBar, Box, IconButton, Typography } from "@mui/material";
import TimeAgo from "react-timeago";
import type { Board } from "../types";
import { BoardOptionsMenu } from "./BoardOptionsMenu";

interface BoardActionBarProps {
	board: Board;
}

export function BoardActionBar({ board }: BoardActionBarProps) {
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
					<IconButton>
						<StarBorderOutlinedIcon />
					</IconButton>
					<BoardOptionsMenu boardId={board.id} />
				</Box>
			</Box>
		</AppBar>
	);
}
