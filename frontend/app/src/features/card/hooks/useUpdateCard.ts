import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../services";
import type { CardListItem } from "../types";

interface useUpdateCardProps {
	originalColumnId?: string;
}

export function useUpdateCard({ originalColumnId }: useUpdateCardProps = {}) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateCard,
		onSuccess: (updated) => {
			queryClient.setQueryData(
				["cards", { column_id: updated.columnId }],
				(oldData: CardListItem[]) => {
					if (!oldData) return oldData;
					const cardExists = oldData.some(
						(card: CardListItem) => card.id === updated.id,
					);
					if (!cardExists) {
						return [...oldData, updated];
					}
					return oldData.map((card: CardListItem) =>
						card.id === updated.id ? updated : card,
					);
				},
			);

			if (originalColumnId && updated.columnId !== originalColumnId) {
				queryClient.setQueryData(
					["cards", { column_id: originalColumnId }],
					(oldData: CardListItem[]) => {
						if (!oldData) return oldData;
						return oldData.filter(
							(card: CardListItem) => card.id !== updated.id,
						);
					},
				);
			}
		},
	});

	return mutation;
}
