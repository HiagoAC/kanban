export type GuestAction = "merge" | "discard";

export interface User {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl?: string;
	isGuest: boolean;
}
