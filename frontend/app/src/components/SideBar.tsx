import {
	DarkMode as DarkModeIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Divider,
	IconButton,
	Link,
	Typography,
} from "@mui/material";
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
				borderRight: "1px solid #ddd",
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
			<Divider />
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					p: 2,
					alignItems: "center",
				}}
			>
				<Box>
					<Button variant="contained" sx={{ bgcolor: "dimgrey" }}>
						SIGN IN
					</Button>
				</Box>
				<Box sx={{ display: "flex", alignItems: "right" }}>
					<IconButton>
						<DarkModeIcon />
					</IconButton>
					<IconButton>
						<SettingsIcon />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
}
