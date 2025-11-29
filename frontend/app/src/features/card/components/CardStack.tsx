import { Stack } from "@mui/material";
import { useFetchCards } from "../hooks/useFetchCards";
import { CardItem } from "./CardItem";

export interface CardStackProps {
	columnId: string;
}

export function CardStack({ columnId }: CardStackProps) {
	const { data: cards } = useFetchCards({ column_id: columnId });

	return (
		<Stack>
			{cards?.map((card) => (
				<CardItem key={card.id} card={card} />
			))}
		</Stack>
	);
}
