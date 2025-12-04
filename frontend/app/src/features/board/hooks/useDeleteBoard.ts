import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteBoard } from "../services";
import type { BoardListItem } from "../types";

export function useDeleteBoard() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: deleteBoard,
		onSuccess: (_, boardId) => {
			queryClient.setQueryData<BoardListItem[]>(["boards"], (old) => {
				if (!old) return old;
				return old.filter((board) => board.id !== boardId);
			});
			navigate("/");
		},
		onError: (error, boardId) => {
			console.log(`Delete board with id ${boardId} failed:`, error);
		},
	});

	return mutation;
}
