interface Column {
	id: string;
	title: string;
}

export interface BoardListItem {
	id: string;
	title: string;
}

export interface Board extends BoardListItem {
	createdAt: Date;
	updatedAt: Date;
	columns: Column[];
}
