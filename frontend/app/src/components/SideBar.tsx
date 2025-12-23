import { Box, Divider, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { SideBarBoardList } from "../features/board/components/SideBarBoardList";
import { SideBarButtonList } from "./SideBarButtonList";

export function SideBar() {
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				borderRight: "1px solid",
				borderColor: "divider",
			}}
		>
			<Link component={RouterLink} to="/" underline="none" color="inherit">
				<Typography variant="h6" fontWeight="bold" sx={{ m: 2 }}>
					KANBAN
				</Typography>
			</Link>
			<SideBarButtonList />
			<Divider />
			<Box sx={{ flexGrow: 1, overflowY: "auto" }}>
				<SideBarBoardList />
			</Box>
		</Box>
	);
}
