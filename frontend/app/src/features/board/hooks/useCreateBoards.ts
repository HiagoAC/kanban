import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSignInPrompt } from "../../auth/contexts/SignInPromptContext";
import { useAuth } from "../../auth/hooks/useAuth";
import { createBoard } from "../services";

export function useCreateBoards() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { showPrompt } = useSignInPrompt();
	const { user } = useAuth();

	const mutation = useMutation({
		mutationFn: createBoard,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["boards"] });
			queryClient.invalidateQueries({ queryKey: ["latestBoard"] });
			navigate(`/boards/${data.id}`);
			if (user?.isGuest) {
				showPrompt();
			}
		},
	});

	return mutation;
}
