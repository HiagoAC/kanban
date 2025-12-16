import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface SideBarListButtonProps {
	onClick: () => void;
	text: string;
	icon?: React.ReactNode;
	selected?: boolean;
}

export function SideBarListButton({
	onClick,
	text,
	icon,
	selected,
}: SideBarListButtonProps) {
	return (
		<ListItemButton
			onClick={onClick}
			sx={{ py: 0, bgcolor: selected ? "#e0e0e0" : "inherit" }}
		>
			<ListItemIcon sx={{ minWidth: "32px", marginRight: "4px" }}>
				{icon || <div />}
			</ListItemIcon>
			<ListItemText
				primary={text}
				slotProps={{
					primary: {
						style: {
							fontSize: "14px",
							fontWeight: selected ? 600 : 500,
							color: "#333",
						},
					},
				}}
			/>
		</ListItemButton>
	);
}
