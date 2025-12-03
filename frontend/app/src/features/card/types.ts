export const PRIORITY_OPTIONS = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITY_OPTIONS)[number];

export type CreateCardSchema = {
	columnId: string;
	title: string;
	body: string | null;
	priority: Priority | null;
};

export interface Card {
	id: string;
	title: string;
	body: string | null;
	priority: Priority;
	createdAt: Date;
	updatedAt: Date;
	columnId: string;
	boardId: string;
}

export type CardListItem = Pick<Card, "id" | "title" | "priority">;

export interface UpdateCardSchema {
	id: string;
	cardData: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>;
}
