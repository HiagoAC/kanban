import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableColumn({
	id,
	children,
}: {
	id: string;
	children: (props: {
		dragListeners: DraggableSyntheticListeners;
	}) => React.ReactNode;
}) {
	const {
		setNodeRef,
		listeners,
		attributes,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		minWidth: 300,
		alignSelf: "stretch",
		marginRight: 16,
		display: "flex",
		flexDirection: "column" as const,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			{children({ dragListeners: listeners })}
		</div>
	);
}
