import { useQuery } from "@tanstack/react-query";
import { fetchCards } from "../services";
import type { CardListItem } from "../types";

export function useFetchCards(params?: Record<string, string>) {
	return useQuery<CardListItem[]>({
		queryKey: ["cards", params],
		queryFn: () => fetchCards(params),
	});
}
