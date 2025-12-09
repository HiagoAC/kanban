import { useMutation } from "@tanstack/react-query";
import { moveCardAbove } from "../services";

export function useMoveCardAbove() {
	const mutation = useMutation({
		mutationFn: moveCardAbove,
	});

	return mutation;
}
