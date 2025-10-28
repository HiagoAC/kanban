import { Add as AddIcon } from "@mui/icons-material";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function SideBarButtonList() {
	const navigate = useNavigate();

	return (
		<List>
			<ListItem disablePadding>
				<ListItemButton onClick={() => navigate("/new-board")}>
					<ListItemIcon sx={{ minWidth: "32px", marginRight: "4px" }}>
						<AddIcon />
					</ListItemIcon>
					<ListItemText
						primary="CREATE NEW KANBAN BOARD"
						slotProps={{
							primary: {
								style: {
									fontSize: "14px",
									fontWeight: 500,
									color: "#333",
								},
							},
						}}
					/>
				</ListItemButton>
			</ListItem>
		</List>
	);
}
