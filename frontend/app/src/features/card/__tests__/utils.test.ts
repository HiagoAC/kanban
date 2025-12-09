import type { DragEndEvent } from "@dnd-kit/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CardListItem } from "../types";
import {
	executeCardMove,
	type MoveCardActions,
	updateCardsOrder,
} from "../utils";

const MOCK_ACTIVE_BASE = {
	data: { current: {} },
	rect: { current: { initial: null, translated: null } },
};

const MOCK_OVER_BASE = {
	data: { current: {} },
	rect: { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 },
	disabled: false,
};

const MOCK_EVENT_BASE = {
	activatorEvent: {} as Event,
	delta: { x: 0, y: 0 },
	collisions: null,
};

const createMockActive = (id: string) => ({ id, ...MOCK_ACTIVE_BASE });
const createMockOver = (id: string) => ({ id, ...MOCK_OVER_BASE });

describe("executeCardMove", () => {
	const mockCards: CardListItem[] = [
		{ id: "card1", title: "Card 1", priority: "low" },
		{ id: "card2", title: "Card 2", priority: "low" },
		{ id: "card3", title: "Card 3", priority: "low" },
		{ id: "card4", title: "Card 4", priority: "low" },
	];

	const mockActions: MoveCardActions = {
		moveCardAbove: vi.fn(),
		moveCardBottom: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return false when there is no over target", () => {
		const event: DragEndEvent = {
			active: createMockActive("card1"),
			over: null,
			...MOCK_EVENT_BASE,
		};

		const result = executeCardMove(event, mockCards, mockActions);

		expect(result).toBe(false);
		expect(mockActions.moveCardAbove).not.toHaveBeenCalled();
		expect(mockActions.moveCardBottom).not.toHaveBeenCalled();
	});

	it("should return false when dragging over itself", () => {
		const event: DragEndEvent = {
			active: createMockActive("card1"),
			over: createMockOver("card1"),
			...MOCK_EVENT_BASE,
		};

		const result = executeCardMove(event, mockCards, mockActions);

		expect(result).toBe(false);
		expect(mockActions.moveCardAbove).not.toHaveBeenCalled();
		expect(mockActions.moveCardBottom).not.toHaveBeenCalled();
	});

	it("should call moveCardAbove when moving card up", () => {
		const event: DragEndEvent = {
			active: createMockActive("card3"),
			over: createMockOver("card1"),
			...MOCK_EVENT_BASE,
		};

		const result = executeCardMove(event, mockCards, mockActions);

		expect(result).toBe(true);
		expect(mockActions.moveCardAbove).toHaveBeenCalledWith({
			cardId: "card3",
			targetCardId: "card1",
		});
		expect(mockActions.moveCardBottom).not.toHaveBeenCalled();
	});

	it("should call moveCardBottom when dropping on the last card", () => {
		const event: DragEndEvent = {
			active: createMockActive("card1"),
			over: createMockOver("card4"),
			...MOCK_EVENT_BASE,
		};

		const result = executeCardMove(event, mockCards, mockActions);

		expect(result).toBe(true);
		expect(mockActions.moveCardBottom).toHaveBeenCalledWith({
			cardId: "card1",
		});
		expect(mockActions.moveCardAbove).not.toHaveBeenCalled();
	});

	it("should call moveCardAbove with next card when moving down", () => {
		const event: DragEndEvent = {
			active: createMockActive("card1"),
			over: createMockOver("card2"),
			...MOCK_EVENT_BASE,
		};

		const result = executeCardMove(event, mockCards, mockActions);

		expect(result).toBe(true);
		expect(mockActions.moveCardAbove).toHaveBeenCalledWith({
			cardId: "card1",
			targetCardId: "card3",
		});
		expect(mockActions.moveCardBottom).not.toHaveBeenCalled();
	});
});

describe("updateCardsOrder", () => {
	const mockCards: CardListItem[] = [
		{ id: "card1", title: "Card 1", priority: "low" },
		{ id: "card2", title: "Card 2", priority: "low" },
		{ id: "card3", title: "Card 3", priority: "low" },
	];

	it("should reorder cards correctly", () => {
		const result = updateCardsOrder(mockCards, "card1", "card3");

		expect(result[0].id).toBe("card2");
		expect(result[1].id).toBe("card3");
		expect(result[2].id).toBe("card1");
	});

	it("should return original array when activeId is not found", () => {
		const result = updateCardsOrder(mockCards, "nonexistent", "card2");

		expect(result).toEqual(mockCards);
	});

	it("should return original array when overId is not found", () => {
		const result = updateCardsOrder(mockCards, "card1", "nonexistent");

		expect(result).toEqual(mockCards);
	});
});
