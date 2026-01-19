import { Avatar, Box, Typography } from "@mui/material";
import type { User } from "../types";

export interface UserInfoProps {
	user: User;
	refreshUser?: () => void;
}

export function UserInfo({ user, refreshUser }: UserInfoProps) {
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
				minWidth: 0,
			}}
		>
			<Avatar
				src={user.avatarUrl}
				alt={`${user.firstName} ${user.lastName}`}
				sx={{
					width: 40,
					height: 40,
					fontSize: 20,
				}}
				onError={refreshUser}
			>
				{!user.avatarUrl && getInitials()}
			</Avatar>
			<Box sx={{ textAlign: "left", minWidth: 0, flex: 1 }}>
				<Typography
					variant="body1"
					sx={{
						fontWeight: 600,
						color: "text.primary",
						lineHeight: 1.2,
						wordBreak: "break-word",
					}}
				>
					{user.firstName} {user.lastName}
				</Typography>
				<Typography
					variant="body2"
					sx={{
						color: "text.secondary",
						lineHeight: 1.2,
						wordBreak: "break-word",
					}}
				>
					{user.email}
				</Typography>
			</Box>
		</Box>
	);
}
