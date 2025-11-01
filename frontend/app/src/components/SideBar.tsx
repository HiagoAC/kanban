import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, Link, Typography } from "@mui/material";
import { SideBarBoardList } from "../features/board/components/SideBarBoardList";
import { SideBarButtonList } from "./SideBarButtonList";

export function SideBar() {
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				borderRight: "1px solid #ddd",
			}}
		>
			<Link
				component={RouterLink}
				to="/"
				underline="none"
				color="inherit"
			>
				<Typography
					variant="h6"
					fontWeight="bold"
					sx={{ m: 2 }}
				>
					KANBAN
				</Typography>
			</Link>
			<SideBarButtonList />
			<Divider />
			<Box sx={{ flexGrow: 1, overflowY: "auto", m: 2 }}>
				<SideBarBoardList />
			</Box>
		</Box>
	);
}
