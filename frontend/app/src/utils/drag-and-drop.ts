import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export interface MoveItemActions<T extends string = string> {
	moveItemAbove: (params: { itemId: T; targetItemId: T }) => void;
	moveItemBottom: (params: { itemId: T }) => void;
}

export interface DraggableItem {
	id: string;
}

export function executeDragMove<T extends DraggableItem>(
	event: DragEndEvent,
	items: T[],
	actions: MoveItemActions,
): boolean {
	const { active, over } = event;

	if (!over || active.id === over.id) {
		return false;
	}

	const overItemIndex = items.findIndex((item) => item.id === over.id);
	const activeItemIndex = items.findIndex((item) => item.id === active.id);
	const isMovingUp = activeItemIndex > overItemIndex;

	if (isMovingUp) {
		actions.moveItemAbove({
			itemId: active.id as string,
			targetItemId: over.id as string,
		});
	} else if (overItemIndex === items.length - 1) {
		actions.moveItemBottom({
			itemId: active.id as string,
		});
	} else {
		const targetItemId = items[overItemIndex + 1].id;
		actions.moveItemAbove({
			itemId: active.id as string,
			targetItemId: targetItemId,
		});
	}

	return true;
}

export function updateItemsOrder<T extends DraggableItem>(
	items: T[],
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier | undefined,
): T[] {
	const oldIndex = items.findIndex((item) => item.id === activeId);
	const newIndex = items.findIndex((item) => item.id === overId);

	if (oldIndex === -1 || newIndex === -1) return items;

	return arrayMove(items, oldIndex, newIndex);
}
