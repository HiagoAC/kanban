import { Add as AddIcon } from "@mui/icons-material";
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
		</List>
	);
}
