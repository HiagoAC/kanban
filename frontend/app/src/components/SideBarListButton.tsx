import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface SideBarListButtonProps {
	onClick: () => void;
	text: string;
	icon?: React.ReactNode;
}

export function SideBarListButton({
	onClick,
	text,
	icon,
}: SideBarListButtonProps) {
	return (
		<ListItemButton onClick={onClick}>
			<ListItemIcon sx={{ minWidth: "32px", marginRight: "4px" }}>
				{icon || <div />}
			</ListItemIcon>
			<ListItemText
				primary={text}
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
	);
}
