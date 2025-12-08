import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../services";

interface useUpdateCardProps {
	originalColumnId?: string;
}

export function useUpdateCard({ originalColumnId }: useUpdateCardProps = {}) {
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
