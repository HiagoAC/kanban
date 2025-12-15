import { useQuery } from "@tanstack/react-query";
import { getLatestBoard } from "../services";
import type { Board } from "../types";

export function useGetLatestBoard() {
	return useQuery<Board | null>({
		queryKey: ["latestBoard"],
		queryFn: () => getLatestBoard(),
	});
}
