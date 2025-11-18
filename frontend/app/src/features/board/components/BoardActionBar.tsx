import {
	Edit as EditIcon,
	StarBorderOutlined as StarBorderOutlinedIcon,
} from "@mui/icons-material";
import { AppBar, Box, IconButton, Typography } from "@mui/material";
import type { Board } from "../types";

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
						Edited {board.updatedAt} ago
					</Typography>
					<IconButton>
						<EditIcon />
					</IconButton>
					<IconButton>
						<StarBorderOutlinedIcon />
					</IconButton>
				</Box>
			</Box>
		</AppBar>
	);
}
