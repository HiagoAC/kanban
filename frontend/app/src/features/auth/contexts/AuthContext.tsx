import { useQueryClient } from "@tanstack/react-query";
import { createContext, useEffect } from "react";
import { useGetMe } from "../hooks/useGetMe";
import { getCSRFToken, logout } from "../services";
import type { User } from "../types";

interface AuthContextType {
	user: User | undefined;
	isAuthenticated: boolean;
	isLoading: boolean;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
	user: undefined,
	isAuthenticated: false,
	isLoading: true,
	logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading } = useGetMe();
	const queryClient = useQueryClient();

	useEffect(() => {
		getCSRFToken();
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			queryClient.clear();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				logout: handleLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
