import { Avatar, Box, Typography } from "@mui/material";
import type { User } from "../types";

interface UserInfoProps {
	user: User;
}

export function UserInfo({ user }: UserInfoProps) {
	const getInitials = () => {
		return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				textTransform: "none",
				justifyContent: "flex-start",
				padding: 1.5,
				borderRadius: 2,
			}}
		>
			<Avatar
				src={user.avatarUrl}
				alt={`${user.firstName} ${user.lastName}`}
				sx={{ width: 40, height: 40 }}
			>
				{!user.avatarUrl && getInitials()}
			</Avatar>
			<Box sx={{ textAlign: "left" }}>
				<Typography
					variant="body1"
					sx={{
						fontWeight: 600,
						color: "text.primary",
						lineHeight: 1.2,
					}}
				>
					{user.firstName} {user.lastName}
				</Typography>
				<Typography
					variant="body2"
					sx={{
						color: "text.secondary",
						lineHeight: 1.2,
					}}
				>
					{user.email}
				</Typography>
			</Box>
		</Box>
	);
}
