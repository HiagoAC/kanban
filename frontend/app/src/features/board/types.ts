export interface Column {
	id: string;
	title: string;
}

export interface UpdateColumnSchema {
	boardId: string;
	columnId: string;
	columnData: Partial<Omit<Column, "id">>;
}

export interface BoardListItem {
	id: string;
	title: string;
	starred: boolean;
	updatedAt: Date;
}

export interface Board extends BoardListItem {
	createdAt: Date;
	columns: Column[];
}

export interface UpdateBoardSchema {
	id: string;
	boardData: Partial<Omit<Board, "id" | "createdAt" | "updatedAt">>;
}
