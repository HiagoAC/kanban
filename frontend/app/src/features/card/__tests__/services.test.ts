import { describe, expect, it, vi, beforeEach } from "vitest";
import apiClient from "../../../services/apiClient";
import {
	fetchCards,
	createCard,
	getCard,
	updateCard,
	deleteCard,
	moveCardAbove,
	moveCardBottom,
} from "../services";

vi.mock("../../../services/apiClient");

beforeEach(() => {
	vi.clearAllMocks();
});

describe("fetchCards", () => {
	it("should fetch cards without params", async () => {
		const mockData = [
			{ id: 1, title: "Card 1" },
			{ id: 2, title: "Card 2" },
		];

		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockData });

		const res = await fetchCards();

		expect(apiClient.get).toHaveBeenCalledWith("cards/", { params: undefined });
		expect(res).toEqual(mockData);
	});

	it("should fetch cards with params", async () => {
		const params = { column: "1" };
		const mockData = [{ id: 1, title: "Filtered Card" }];

		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockData });

		const res = await fetchCards(params);

		expect(apiClient.get).toHaveBeenCalledWith("cards/", { params });
		expect(res).toEqual(mockData);
	});
});

describe("createCard", () => {
	it("should create a card and convert dates", async () => {
		const cardData = {
			title: "New Card",
			columnId: "1",
		};

		const mockResponse = {
			id: 1,
			title: "New Card",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
		};

		(apiClient.post as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await createCard(cardData as any);

		expect(apiClient.post).toHaveBeenCalledWith("cards/", cardData);
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("getCard", () => {
	it("should fetch a card by id and convert dates", async () => {
		const mockResponse = {
			id: 1,
			title: "Card",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
		};

		(apiClient.get as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await getCard("1");

		expect(apiClient.get).toHaveBeenCalledWith("cards/1/");
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("updateCard", () => {
	it("should update a card and convert dates", async () => {
		const mockResponse = {
			id: 1,
			title: "Updated Card",
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-03T00:00:00Z",
		};

		(apiClient.patch as vi.Mock).mockResolvedValue({ data: mockResponse });

		const res = await updateCard({
			id: "1",
			cardData: { title: "Updated Card" },
		} as any);

		expect(apiClient.patch).toHaveBeenCalledWith(
			"cards/1/",
			{ title: "Updated Card" },
		);
		expect(res.createdAt).toBeInstanceOf(Date);
		expect(res.updatedAt).toBeInstanceOf(Date);
	});
});

describe("deleteCard", () => {
	it("should delete a card by id", async () => {
		(apiClient.delete as vi.Mock).mockResolvedValue({});

		await deleteCard("1");

		expect(apiClient.delete).toHaveBeenCalledWith("cards/1/");
	});
});

describe("moveCardAbove", () => {
	it("should move a card above another card", async () => {
		(apiClient.post as vi.Mock).mockResolvedValue({});

		await moveCardAbove({
			cardId: "1",
			targetCardId: "2",
		});

		expect(apiClient.post).toHaveBeenCalledWith(
			"cards/1/move-above/",
			{ target_card_id: "2" },
		);
	});
});

describe("moveCardBottom", () => {
	it("should move a card to the bottom", async () => {
		(apiClient.post as vi.Mock).mockResolvedValue({});

		await moveCardBottom({
			cardId: "1",
		});

		expect(apiClient.post).toHaveBeenCalledWith(
			"cards/1/move-bottom/",
		);
	});
});
