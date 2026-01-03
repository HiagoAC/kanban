import { Button } from "@mui/material";

interface SignInButtonProps {
	serviceName: string;
	onClick?: () => void;
	icon: React.ReactNode;
	isLoading?: boolean;
}

export function SignInButton({
	serviceName,
	onClick,
	icon,
	isLoading = false,
}: SignInButtonProps) {
	return (
		<Button
			variant="outlined"
			fullWidth
			size="large"
			disabled={isLoading}
			onClick={onClick}
			startIcon={icon}
			sx={{
				py: 1.5,
				borderColor: "divider",
				color: "text.primary",
				"&:hover": {
					backgroundColor: "action.hover",
					borderColor: "primary.main",
				},
				"&:disabled": {
					opacity: 0.6,
				},
			}}
		>
			{isLoading ? "Signing in..." : `Continue with ${serviceName}`}
		</Button>
	);
}
