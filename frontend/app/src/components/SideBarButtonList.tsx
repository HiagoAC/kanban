import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import { List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SideBarListButton } from "./SideBarListButton";

export function SideBarButtonList() {
	const navigate = useNavigate();

	return (
		<List>
			<ListItem disablePadding>
				<SideBarListButton
					onClick={() => navigate("/sign-in")}
					text="Sign In"
					icon={<LoginIcon />}
				/>
			</ListItem>
			<ListItem disablePadding>
				<SideBarListButton
					onClick={() => navigate("/new-board")}
					text="Create Board"
					icon={<AddIcon />}
				/>
			</ListItem>
		</List>
	);
}
