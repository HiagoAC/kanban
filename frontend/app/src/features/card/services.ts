import apiClient from "../../services/apiClient";
import type { CardListItem } from "./types";

const CARD_URL = "cards/";

export const fetchCards = async (
	params?: Record<string, string>,
): Promise<CardListItem[]> => {
	const res = await apiClient.get<CardListItem[]>(CARD_URL, { params });
	return res.data;
};
