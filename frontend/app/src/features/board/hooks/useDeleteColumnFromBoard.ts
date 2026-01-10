import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteColumnFromBoard } from "../services";
import type { Board } from "../types";

export function useDeleteColumnFromBoard() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteColumnFromBoard,
		onSuccess: (_, variables) => {
			queryClient.setQueryData<Board>(
				["board", String(variables.boardId)],
				(old) => {
					if (!old) {
						return old;
					}
					return {
						...old,
						columns: old.columns.filter((c) => c.id !== variables.columnId),
					};
				},
			);
			queryClient.invalidateQueries({ queryKey: ["latestBoard"] });
		},
		onError: (error, variables) => {
			console.log(`Delete column with id ${variables.columnId} failed:`, error);
		},
	});

	return mutation;
}
