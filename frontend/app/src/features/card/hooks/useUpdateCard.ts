import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../services";
import type { CardListItem } from "../types";

export function useUpdateCard() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateCard,
		onSuccess: (updated) => {
			queryClient.setQueryData(["cards"], (old: CardListItem[] | undefined) => {
				if (!old) return old;
				return old.map(
					(card): CardListItem =>
						card.id === updated.id ? { ...card, ...updated } : card,
				);
			});
			queryClient.setQueryData(["cards", String(updated.id)], updated);
		},
	});

	return mutation;
}
