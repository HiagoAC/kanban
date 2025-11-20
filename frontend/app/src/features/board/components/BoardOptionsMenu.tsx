import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useId, useState } from "react";

export function BoardOptionsMenu() {
	const buttonId = useId();
	const menuId = useId();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				id={buttonId}
				aria-controls={open ? "board-options-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<MoreHorizIcon />
			</IconButton>
			<Menu
				id={menuId}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				slotProps={{
					list: {
						"aria-labelledby": "board-options-button",
					},
				}}
			>
				<MenuItem onClick={handleClose}>Rename Board</MenuItem>
				<MenuItem onClick={handleClose}>Add Column</MenuItem>
				<MenuItem onClick={handleClose}>Delete Column</MenuItem>
			</Menu>
		</div>
	);
}
