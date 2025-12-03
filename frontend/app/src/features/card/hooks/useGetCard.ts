import { useQuery } from "@tanstack/react-query";
import { getCard } from "../services";
import type { Card } from "../types";

export function useGetCard(id: string) {
	return useQuery<Card>({
		queryKey: ["card", id],
		queryFn: () => getCard(id),
	});
}
