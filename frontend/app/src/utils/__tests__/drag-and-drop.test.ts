import type { DragEndEvent } from "@dnd-kit/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type DraggableItem,
	executeDragMove,
	type MoveItemActions,
	updateItemsOrder,
} from "../drag-and-drop";

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

describe("executeDragMove", () => {
	const mockItems: DraggableItem[] = [
		{ id: "item1" },
		{ id: "item2" },
		{ id: "item3" },
		{ id: "item4" },
	];

	const mockActions: MoveItemActions = {
		moveItemAbove: vi.fn(),
		moveItemBottom: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return false when there is no over target", () => {
		const event: DragEndEvent = {
			active: createMockActive("item1"),
			over: null,
			...MOCK_EVENT_BASE,
		};

		const result = executeDragMove(event, mockItems, mockActions);

		expect(result).toBe(false);
		expect(mockActions.moveItemAbove).not.toHaveBeenCalled();
		expect(mockActions.moveItemBottom).not.toHaveBeenCalled();
	});

	it("should return false when dragging over itself", () => {
		const event: DragEndEvent = {
			active: createMockActive("item1"),
			over: createMockOver("item1"),
			...MOCK_EVENT_BASE,
		};

		const result = executeDragMove(event, mockItems, mockActions);

		expect(result).toBe(false);
		expect(mockActions.moveItemAbove).not.toHaveBeenCalled();
		expect(mockActions.moveItemBottom).not.toHaveBeenCalled();
	});

	it("should call moveItemAbove when moving item up", () => {
		const event: DragEndEvent = {
			active: createMockActive("item3"),
			over: createMockOver("item1"),
			...MOCK_EVENT_BASE,
		};

		const result = executeDragMove(event, mockItems, mockActions);

		expect(result).toBe(true);
		expect(mockActions.moveItemAbove).toHaveBeenCalledWith({
			itemId: "item3",
			targetItemId: "item1",
		});
		expect(mockActions.moveItemBottom).not.toHaveBeenCalled();
	});

	it("should call moveItemBottom when dropping on the last item", () => {
		const event: DragEndEvent = {
			active: createMockActive("item1"),
			over: createMockOver("item4"),
			...MOCK_EVENT_BASE,
		};

		const result = executeDragMove(event, mockItems, mockActions);

		expect(result).toBe(true);
		expect(mockActions.moveItemBottom).toHaveBeenCalledWith({
			itemId: "item1",
		});
		expect(mockActions.moveItemAbove).not.toHaveBeenCalled();
	});

	it("should call moveItemAbove with next item when moving down", () => {
		const event: DragEndEvent = {
			active: createMockActive("item1"),
			over: createMockOver("item2"),
			...MOCK_EVENT_BASE,
		};

		const result = executeDragMove(event, mockItems, mockActions);

		expect(result).toBe(true);
		expect(mockActions.moveItemAbove).toHaveBeenCalledWith({
			itemId: "item1",
			targetItemId: "item3",
		});
		expect(mockActions.moveItemBottom).not.toHaveBeenCalled();
	});
});

describe("updateItemsOrder", () => {
	const mockItems: DraggableItem[] = [
		{ id: "item1" },
		{ id: "item2" },
		{ id: "item3" },
	];

	it("should reorder items correctly", () => {
		const result = updateItemsOrder(mockItems, "item1", "item3");

		expect(result[0].id).toBe("item2");
		expect(result[1].id).toBe("item3");
		expect(result[2].id).toBe("item1");
	});

	it("should return original array when activeId is not found", () => {
		const result = updateItemsOrder(mockItems, "nonexistent", "item2");

		expect(result).toEqual(mockItems);
	});

	it("should return original array when overId is not found", () => {
		const result = updateItemsOrder(mockItems, "item1", "nonexistent");

		expect(result).toEqual(mockItems);
	});

	it("should handle complex item types", () => {
		interface ComplexItem extends DraggableItem {
			name: string;
			value: number;
		}

		const complexItems: ComplexItem[] = [
			{ id: "a", name: "First", value: 1 },
			{ id: "b", name: "Second", value: 2 },
			{ id: "c", name: "Third", value: 3 },
		];

		const result = updateItemsOrder(complexItems, "a", "c");

		expect(result[0]).toEqual({ id: "b", name: "Second", value: 2 });
		expect(result[1]).toEqual({ id: "c", name: "Third", value: 3 });
		expect(result[2]).toEqual({ id: "a", name: "First", value: 1 });
	});
});
