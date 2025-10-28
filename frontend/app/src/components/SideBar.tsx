import { Box, Divider } from "@mui/material";
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
			<SideBarButtonList />
			<Divider />
			<Box sx={{ flexGrow: 1, overflowY: "auto", m: 2 }}>Board List</Box>
		</Box>
	);
}
