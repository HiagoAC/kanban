import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSignInPrompt } from "../../auth/contexts/SignInPromptContext";
import { useAuth } from "../../auth/hooks/useAuth";
import { createCard } from "../services";

export function useCreateCard() {
	const queryClient = useQueryClient();
	const { showPrompt } = useSignInPrompt();
	const { user } = useAuth();

	const mutation = useMutation({
		mutationFn: createCard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
			if (user?.isGuest) {
				showPrompt();
			}
		},
	});

	return mutation;
}
