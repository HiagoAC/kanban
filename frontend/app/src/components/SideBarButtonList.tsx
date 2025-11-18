import {
	Add as AddIcon,
	Home as HomeIcon,
	Search as SearchIcon,
} from "@mui/icons-material";
import { List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SideBarListButton } from "./SideBarListButton";

export function SideBarButtonList() {
	const navigate = useNavigate();

	return (
		<List>
			<ListItem disablePadding>
				<SideBarListButton
					onClick={() => navigate("/new-board")}
					text="Create New Board"
					icon={<AddIcon />}
				/>
			</ListItem>
			<ListItem disablePadding>
				<SideBarListButton
					onClick={() => {}}
					text="Search"
					icon={<SearchIcon />}
				/>
			</ListItem>
			<ListItem disablePadding>
				<SideBarListButton
					onClick={() => navigate("/")}
					text="Home"
					icon={<HomeIcon />}
				/>
			</ListItem>
		</List>
	);
}
