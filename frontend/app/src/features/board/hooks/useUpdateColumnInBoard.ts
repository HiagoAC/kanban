import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateColumnInBoard } from "../services";

export function useUpdateColumnInBoard() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateColumnInBoard,
		onSuccess: (updated) => {
			queryClient.setQueryData(["board", String(updated.id)], updated);
			queryClient.invalidateQueries({ queryKey: ["latestBoard"] });
		},
	});

	return mutation;
}
