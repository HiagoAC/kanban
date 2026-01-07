import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services";
import type { User } from "../types";

export function useGetMe() {
	return useQuery<User>({
		queryKey: ["me"],
		queryFn: () => getMe(),
		retry: false,
	});
}
