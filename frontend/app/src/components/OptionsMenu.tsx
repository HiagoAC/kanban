import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useId, useState } from "react";

interface OptionsMenuItem {
	label: string;
	onClick: () => void;
	iconSize?: "small" | "medium" | "large";
}

interface OptionsMenuProps {
	items: OptionsMenuItem[];
	iconSize?: "small" | "medium" | "large";
}

export function OptionsMenu({ items, iconSize = "medium" }: OptionsMenuProps) {
	const buttonId = useId();
	const menuId = useId();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<IconButton
				id={buttonId}
				aria-controls={open ? menuId : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<MoreHorizIcon fontSize={iconSize} />
			</IconButton>

			<Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
				{items.map(({ label, onClick }) => (
					<MenuItem
						key={label}
						onClick={() => {
							handleClose();
							onClick();
						}}
					>
						{label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
