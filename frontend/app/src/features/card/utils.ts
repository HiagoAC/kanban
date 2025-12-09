import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { CardListItem } from "./types";

export interface MoveCardActions {
	moveCardAbove: (params: { cardId: string; targetCardId: string }) => void;
	moveCardBottom: (params: { cardId: string }) => void;
}

export function executeCardMove(
	event: DragEndEvent,
	cards: CardListItem[],
	actions: MoveCardActions,
): boolean {
	const { active, over } = event;

	if (!over || active.id === over.id) {
		return false;
	}

	const overCardIndex = cards.findIndex((c) => c.id === over.id);
	const activeCardIndex = cards.findIndex((c) => c.id === active.id);
	const isMovingUp = activeCardIndex > overCardIndex;

	if (isMovingUp) {
		actions.moveCardAbove({
			cardId: active.id as string,
			targetCardId: over.id as string,
		});
	} else if (overCardIndex === cards.length - 1) {
		actions.moveCardBottom({
			cardId: active.id as string,
		});
	} else {
		const targetCardId = cards[overCardIndex + 1].id;
		actions.moveCardAbove({
			cardId: active.id as string,
			targetCardId: targetCardId,
		});
	}

	return true;
}

export function updateCardsOrder(
	cards: CardListItem[],
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier | undefined,
): CardListItem[] {
	const oldIndex = cards.findIndex((c) => c.id === activeId);
	const newIndex = cards.findIndex((c) => c.id === overId);

	if (oldIndex === -1 || newIndex === -1) return cards;

	return arrayMove(cards, oldIndex, newIndex);
}
