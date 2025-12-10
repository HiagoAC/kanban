import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { SortableItem } from "../../../components/SortableItem";
import { useFetchCards } from "../hooks/useFetchCards";
import { useMoveCardAbove } from "../hooks/useMoveCardAbove";
import { useMoveCardBottom } from "../hooks/useMoveCardBottom";
import type { CardListItem } from "../types";
import { executeCardMove, updateCardsOrder } from "../utils";
import { CardItem } from "./CardItem";

export interface CardStackProps {
	columnId: string;
	prevColumnId?: string;
	nextColumnId?: string;
}

export function CardStack({
	columnId,
	prevColumnId,
	nextColumnId,
}: CardStackProps) {
	const { data: CardsData = [] } = useFetchCards({ column_id: columnId });
	const [cards, setCards] = useState<CardListItem[]>([]);
	const { mutate: moveCardAbove } = useMoveCardAbove();
	const { mutate: moveCardBottom } = useMoveCardBottom();

	useEffect(() => {
		setCards(CardsData);
	}, [CardsData]);

	const handleDragEnd = (event: DragEndEvent) => {
		const shouldUpdate = executeCardMove(event, cards, {
			moveCardAbove,
			moveCardBottom,
		});
		if (shouldUpdate) {
			setCards((items) =>
				updateCardsOrder(items, event.active.id, event.over?.id),
			);
		}
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<SortableContext items={cards || []}>
				<Stack spacing={1} sx={{ py: 1 }}>
					{cards?.map((card) => (
						<SortableItem id={card.id} key={card.id}>
							{({ dragListeners }) => (
								<CardItem
									dragListeners={dragListeners}
									key={card.id}
									card={card}
									columnId={columnId}
									prevColumnId={prevColumnId}
									nextColumnId={nextColumnId}
								/>
							)}
						</SortableItem>
					))}
				</Stack>
			</SortableContext>
		</DndContext>
	);
}
