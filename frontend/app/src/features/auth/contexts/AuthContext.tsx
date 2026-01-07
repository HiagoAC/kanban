import { createContext, useEffect } from "react";
import { useGetMe } from "../hooks/useGetMe";
import { getCSRFToken } from "../services";
import type { User } from "../types";

interface AuthContextType {
	user: User | undefined;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading } = useGetMe();

	useEffect(() => {
		getCSRFToken();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
