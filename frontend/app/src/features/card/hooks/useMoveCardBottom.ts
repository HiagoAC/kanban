import { useMutation } from "@tanstack/react-query";
import { moveCardBottom } from "../services";

export function useMoveCardBottom() {
	const mutation = useMutation({
		mutationFn: moveCardBottom,
	});

	return mutation;
}
