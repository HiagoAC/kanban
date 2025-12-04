import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCard } from "../services";
import type { CardListItem } from "../types";

export function useDeleteCard(columnId?: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteCard,
		onSuccess: (_, cardId) => {
			queryClient.setQueryData<CardListItem[]>(
				["cards", { column_id: columnId }],
				(old) => {
					if (!old) return old;
					return old.filter((card) => card.id !== cardId);
				}
			);
		},
		onError: (error, cardId) => {
			console.log(`Delete card with id ${cardId} failed:`, error);
		},
	});

	return {
		...mutation,
		mutate: (...args: Parameters<typeof mutation.mutate>) => {
			if (!columnId) {
				console.warn("Cannot delete card: columnId missing");
				return;
			}
			mutation.mutate(...args);
		},
	};
}
