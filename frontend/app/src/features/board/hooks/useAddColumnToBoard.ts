import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addColumnToBoard } from "../services";

interface params {
	boardId: string;
	columnTitle: string;
}

export function useAddColumnToBoard() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ boardId, columnTitle }: params) =>
			addColumnToBoard(boardId, columnTitle),
		onSuccess: (data) => {
			queryClient.setQueryData(["board", String(data.id)], data);
		},
	});

	return mutation;
}
