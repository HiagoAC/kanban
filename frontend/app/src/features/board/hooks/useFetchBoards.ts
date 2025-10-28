import { useQuery } from "@tanstack/react-query";
import { fetchBoards } from "../services";
import type { BoardListItem } from "../types";

export function useFetchBoards() {
	return useQuery<BoardListItem[]>({
		queryKey: ["boards"],
		queryFn: fetchBoards,
	});
}
