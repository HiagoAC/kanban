import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { SortableItem } from "../../../components/SortableItem";
import { useFetchCards } from "../hooks/useFetchCards";
import type { CardListItem } from "../types";
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

	useEffect(() => {
		setCards(CardsData);
	}, [CardsData]);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		setCards((items) => {
			const oldIndex = items.findIndex((c) => c.id === active.id);
			const newIndex = items.findIndex((c) => c.id === over.id);
			if (oldIndex === -1 || newIndex === -1) return items;
			return arrayMove(items, oldIndex, newIndex);
		});
	};
	return (
		<DndContext onDragEnd={handleDragEnd}>
			<SortableContext items={cards || []}>
				<Stack spacing={0} sx={{ px: 2 }}>
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
