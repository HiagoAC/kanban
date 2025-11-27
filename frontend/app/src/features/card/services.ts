import apiClient from "../../services/apiClient";
import type { Card, CardListItem, CreateCardSchema } from "./types";

const CARD_URL = "cards/";

export const fetchCards = async (
	params?: Record<string, string>,
): Promise<CardListItem[]> => {
	const res = await apiClient.get<CardListItem[]>(CARD_URL, { params });
	return res.data;
};

export const createCard = async (
	card_data: CreateCardSchema,
): Promise<Card> => {
	console.log("Creating card with data:", card_data);
	const res = await apiClient.post<Card>(CARD_URL, card_data);
	const card = res.data;
	card.createdAt = new Date(card.createdAt);
	card.updatedAt = new Date(card.updatedAt);
	return card;
};
