import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../services";

export function useCreateCard() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: createCard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
		},
	});

	return mutation;
}
