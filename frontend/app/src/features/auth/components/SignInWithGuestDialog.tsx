import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { signInWithGoogle } from "../services";
import type { GuestAction } from "../types";
import { GuestUserActionDialog } from "./GuestUserActionDialog";
import { SignInButton } from "./SignInButton";

interface SignInWithGuestDialogProps {
	serviceName: string;
	icon: React.ReactNode;
	isLoading?: boolean;
}

export function SignInWithGuestDialog({
	serviceName,
	icon,
	isLoading = false,
}: SignInWithGuestDialogProps) {
	const { user } = useAuth();
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleClick = () => {
		if (user?.isGuest) {
			setDialogOpen(true);
		} else {
			signInWithGoogle();
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleGuestAction = (action: GuestAction) => {
		signInWithGoogle(action);
	};

	return (
		<>
			<SignInButton
				serviceName={serviceName}
				onClick={handleClick}
				icon={icon}
				isLoading={isLoading}
			/>
			<GuestUserActionDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				setAction={handleGuestAction}
			/>
		</>
	);
}
