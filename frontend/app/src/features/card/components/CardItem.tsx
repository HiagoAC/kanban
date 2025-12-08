import type { DraggableSyntheticListeners } from "@dnd-kit/core/dist/hooks/useDraggable";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
	Box,
	ButtonBase,
	Grid,
	IconButton,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUpdateCard } from "../hooks/useUpdateCard";
import type { CardListItem } from "../types";
import { PriorityDot } from "./PriorityDot";

interface CardItemProps {
	card: CardListItem;
	columnId: string;
	nextColumnId?: string;
	prevColumnId?: string;
	dragListeners: DraggableSyntheticListeners;
}

export function CardItem({
	card,
	columnId,
	nextColumnId,
	prevColumnId,
	dragListeners,
}: CardItemProps) {
	const navigate = useNavigate();
	const { mutate: updateCard } = useUpdateCard({ originalColumnId: columnId });

	return (
		<Paper
			component={ButtonBase}
			onClick={() => navigate(`/cards/${card.id}`)}
			elevation={3}
			sx={{
				mt: 2,
				bgcolor: "lightgrey",
				width: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
			>
				<IconButton
					{...dragListeners}
					sx={{ cursor: "grab" }}
					aria-label="Drag card"
				>
					<DragIndicatorIcon fontSize="small" />
				</IconButton>
			</Box>
			<Grid
				container
				alignItems="center"
				justifyContent="space-between"
				wrap="nowrap"
				sx={{ width: "100%", pb: 2 }}
			>
				<Grid size={2} alignContent="center">
					{prevColumnId && (
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								updateCard({
									id: card.id,
									cardData: { columnId: prevColumnId },
								});
							}}
						>
							<ArrowLeftIcon />
						</IconButton>
					)}
				</Grid>
				<Grid size={8}>
					<Stack alignItems="center">
						<Typography variant="subtitle1" fontWeight="bold">
							{card.title}
						</Typography>
						<Stack direction="row" spacing={0.2} my={1} alignItems="center">
							<PriorityDot priority={card.priority} />
							<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
								{card.priority}-priority
							</Typography>
						</Stack>
					</Stack>
				</Grid>
				<Grid size={2} alignContent="center">
					{nextColumnId && (
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								updateCard({
									id: card.id,
									cardData: { columnId: nextColumnId },
								});
							}}
						>
							<ArrowRightIcon />
						</IconButton>
					)}
				</Grid>
			</Grid>
		</Paper>
	);
}
