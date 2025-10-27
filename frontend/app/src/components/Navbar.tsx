import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export function Navbar() {
	return (
		<AppBar position="static" sx={{ m: 0, p: 0 }}>
			<Toolbar>
				<Typography variant="h6" sx={{ flexGrow: 1 }}>
					Kanban Boards
				</Typography>
				<Button color="inherit">Login</Button>
			</Toolbar>
		</AppBar>
	);
}
