import CircleIcon from "@mui/icons-material/Circle";
import { ButtonBase, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CardListItem } from "../types";

interface CardItemProps {
	card: CardListItem;
}

export function CardItem({ card }: CardItemProps) {
	const navigate = useNavigate();

	const priorityToChipColor = {
		high: "error",
		medium: "warning",
		low: "info",
	} as const;

	const priorityColor = card.priority
		? priorityToChipColor[card.priority]
		: "primary";

	return (
		<Paper
			component={ButtonBase}
			onClick={() => navigate(`/cards/${card.id}`)}
			elevation={3}
			sx={{ p: 2, mt: 2, mx: 2, bgcolor: "lightgrey" }}
		>
			<Stack>
				<Typography variant="subtitle1" fontWeight="bold">
					{card.title}
				</Typography>
				<Stack direction="row" spacing={0.2} my={1} alignItems="center">
					<CircleIcon sx={{ fontSize: 12 }} color={priorityColor} />
					<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
						{card.priority}-priority
					</Typography>
				</Stack>
			</Stack>
		</Paper>
	);
}
