import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../services";

export function useUpdateCard({
	originalColumnId,
}: {
	originalColumnId?: string;
}) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateCard,
		onSuccess: (updated) => {
			queryClient.invalidateQueries({
				queryKey: ["cards", { column_id: updated.columnId }],
			});
			if (originalColumnId && updated.columnId !== originalColumnId) {
				queryClient.invalidateQueries({
					queryKey: ["cards", { column_id: originalColumnId }],
				});
			}
		},
	});

	return mutation;
}
