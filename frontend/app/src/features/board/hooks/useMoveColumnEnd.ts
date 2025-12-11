import { useMutation } from "@tanstack/react-query";
import { moveColumnEnd } from "../services";

export function useMoveColumnEnd() {
	const mutation = useMutation({
		mutationFn: moveColumnEnd,
	});

	return mutation;
}
