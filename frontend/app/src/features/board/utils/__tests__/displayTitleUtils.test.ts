import { describe, expect, it } from "vitest";
import type { BoardListItem } from "../../types";
import { generateDisplayTitles } from "../displayTitleUtils";

describe("generateDisplayTitles", () => {
	const createMockBoard = (
		id: string,
		title: string,
		createdAt: string,
	): BoardListItem => ({
		id,
		title,
		starred: false,
		createdAt: new Date(createdAt),
		updatedAt: new Date(createdAt),
	});

	it("should return original titles when no duplicates exist", () => {
		const boards = [
			createMockBoard("1", "Project A", "2024-01-01"),
			createMockBoard("2", "Project B", "2024-01-02"),
		];

		const result = generateDisplayTitles(boards);

		expect(result.get(1)).toBe("Project A");
		expect(result.get(2)).toBe("Project B");
	});

	it("should add numbering for duplicate titles based on creation order", () => {
		const boards = [
			createMockBoard("1", "Project", "2024-01-01"),
			createMockBoard("2", "Project", "2024-01-02"),
			createMockBoard("3", "Another Project", "2024-01-03"),
			createMockBoard("4", "Project", "2024-01-03"),
		];

		const result = generateDisplayTitles(boards);

		expect(result.get(1)).toBe("Project");
		expect(result.get(2)).toBe("Project (1)");
		expect(result.get(3)).toBe("Another Project");
		expect(result.get(4)).toBe("Project (2)");
	});

	it("should sort duplicates by createdAt regardless of input order", () => {
		const boards = [
			createMockBoard("3", "Test", "2024-01-03"), // Latest
			createMockBoard("1", "Test", "2024-01-01"), // Oldest
			createMockBoard("2", "Test", "2024-01-02"), // Middle
		];

		const result = generateDisplayTitles(boards);

		expect(result.get(1)).toBe("Test");
		expect(result.get(2)).toBe("Test (1)");
		expect(result.get(3)).toBe("Test (2)");
	});
});
