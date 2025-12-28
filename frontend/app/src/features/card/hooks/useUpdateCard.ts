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
		onMutate: (variables) => {
			const { id, cardData } = variables;
			const sourceColumnId = originalColumnId || cardData.columnId;
			const cardsData = queryClient.getQueryData<CardListItem[]>([
				"cards",
				{ column_id: sourceColumnId },
			]);
			const originalCard = cardsData?.find((card) => card.id === id);
			if (!originalCard) return;

			const updatedCard = {
				...originalCard,
				...Object.fromEntries(
					Object.entries(cardData).filter(([key]) => key in originalCard),
				),
			} as CardListItem;

			// Update new column
			queryClient.setQueryData(
				["cards", { column_id: cardData.columnId }],
				(oldData: CardListItem[]) => {
					if (!oldData) return oldData;
					const cardExists = oldData.some(
						(card: CardListItem) => card.id === updatedCard.id,
					);
					if (!cardExists) {
						return [...oldData, updatedCard];
					}
					return oldData.map((card: CardListItem) =>
						card.id === updatedCard.id ? updatedCard : card,
					);
				},
			);

			// Update original column if changed
			if (originalColumnId && cardData.columnId !== originalColumnId) {
				queryClient.setQueryData(
					["cards", { column_id: originalColumnId }],
					(oldData: CardListItem[]) => {
						if (!oldData) return oldData;
						return oldData.filter(
							(card: CardListItem) => card.id !== updatedCard.id,
						);
					},
				);
			}
		},
	});

	return mutation;
}
