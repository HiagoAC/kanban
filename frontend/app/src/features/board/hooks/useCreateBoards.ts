import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../services";

export function useCreateBoards() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: createBoard,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["boards"] });
			queryClient.invalidateQueries({ queryKey: ["latestBoard"] });
			navigate(`/boards/${data.id}`);
		},
	});

	return mutation;
}
