import { useQuery } from "@tanstack/react-query";
import { getBoard } from "../services";
import type { Board } from "../types";

export function useGetBoard(id: string) {
	return useQuery<Board>({
		queryKey: ["board", id],
		queryFn: () => getBoard(id),
	});
}
