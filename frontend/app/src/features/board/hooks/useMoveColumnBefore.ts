import { useMutation } from "@tanstack/react-query";
import { moveColumnBefore } from "../services";

export function useMoveColumnBefore() {
	const mutation = useMutation({
		mutationFn: moveColumnBefore,
	});

	return mutation;
}
