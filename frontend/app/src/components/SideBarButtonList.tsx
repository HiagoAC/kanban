import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Login";
import LoginIcon from "@mui/icons-material/Logout";
import { List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../features/auth/components/UserInfo";
import { useAuth } from "../features/auth/hooks/useAuth";
import { SideBarListButton } from "./SideBarListButton";

export function SideBarButtonList() {
	const navigate = useNavigate();
	const { user, isAuthenticated, logout } = useAuth();
	const handleLogout = async () => {
		await logout();
		navigate("/sign-in");
	};

	return (
		<List>
			{isAuthenticated && user && !user.isGuest ? (
				<>
					<ListItem disablePadding>
						<UserInfo user={user} />
					</ListItem>
					<ListItem disablePadding>
						<SideBarListButton
							onClick={handleLogout}
							text="Sign Out"
							icon={<LogoutIcon />}
						/>
					</ListItem>
				</>
			) : (
				<ListItem disablePadding>
					<SideBarListButton
						onClick={() => navigate("/sign-in")}
						text="Sign In"
						icon={<LoginIcon />}
					/>
				</ListItem>
			)}
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
