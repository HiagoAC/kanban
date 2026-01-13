import type { BoardListItem } from "../types";

export function generateDisplayTitles(
	boards: BoardListItem[],
): Map<number, string> {
	const titleGroups = new Map<string, BoardListItem[]>();
	const displayTitles = new Map<number, string>();

	for (const board of boards) {
		if (!titleGroups.has(board.title)) {
			titleGroups.set(board.title, []);
		}
		titleGroups.get(board.title)?.push(board);
	}

	for (const [title, boardsWithSameTitle] of titleGroups) {
		if (boardsWithSameTitle.length === 1) {
			displayTitles.set(Number(boardsWithSameTitle[0].id), title);
		} else {
			const sortedBoards = boardsWithSameTitle.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			);
			sortedBoards.forEach((board, index) => {
				if (index === 0) {
					displayTitles.set(Number(board.id), title);
				} else {
					displayTitles.set(Number(board.id), `${title} (${index})`);
				}
			});
		}
	}

	return displayTitles;
}
