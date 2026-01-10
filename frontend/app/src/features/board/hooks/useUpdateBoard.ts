import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBoard } from "../services";
import type { BoardListItem } from "../types";

export function useUpdateBoard() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateBoard,
		onSuccess: (updated) => {
			queryClient.setQueryData(
				["boards"],
				(old: BoardListItem[] | undefined) => {
					if (!old) return old;
					return old.map((board) =>
						board.id === updated.id
							? {
									id: updated.id,
									title: updated.title,
									starred: updated.starred,
								}
							: board,
					);
				},
			);
			queryClient.setQueryData(["board", String(updated.id)], updated);
			queryClient.invalidateQueries({ queryKey: ["latestBoard"] });
		},
	});

	return mutation;
}
