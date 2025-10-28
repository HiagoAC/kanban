interface Column {
	id: string;
	title: string;
}

export interface BoardListItem {
	id: string;
	title: string;
}

export interface Board extends BoardListItem {
	createdAt: string;
	columns: Column[];
}
