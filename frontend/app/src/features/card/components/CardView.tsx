import { Box, Button, Divider, TextField } from "@mui/material";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveBoard } from "../../board/contexts/ActiveBoardContext";
import { useGetBoard } from "../../board/hooks/useGetBoard";
import type { Board } from "../../board/types";
import { useDeleteCard } from "../hooks/useDeleteCard";
import { useGetCard } from "../hooks/useGetCard";
import { useUpdateCard } from "../hooks/useUpdateCard";
import type { Card } from "../types";
import { CardActionBar } from "./CardActionBar";
import { CardEditControls } from "./CardEditControls";

export function CardView({ id }: { id: string }) {
	const { data: card, isLoading } = useGetCard(id);
	const boardId = card?.boardId;
	const { data: board } = useGetBoard(boardId);
	const [cardData, setCardData] = useState<
		Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>
	>({});
	const { mutate: updateCard } = useUpdateCard();
	const { mutate: deleteCard } = useDeleteCard(card?.columnId);
	const { setActiveBoardId } = useActiveBoard();

	const titleInputId = useId();
	const columnSelectId = useId();
	const prioritySelectId = useId();
	const bodyInputId = useId();

	const leftEdgeOffset = 4;

	const navigate = useNavigate();

	useEffect(() => {
		if (board) {
			setActiveBoardId(board.id);
		}
	}, [board, setActiveBoardId]);

	useEffect(() => {
		if (card) {
			const {
				id: _id,
				createdAt: _createdAt,
				updatedAt: _updatedAt,
				...editable
			} = card;
			setCardData(editable);
		}
	}, [card]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSave = () => {
		if (cardData) {
			updateCard({ id, cardData });
			navigate(`/boards/${card?.boardId}`);
		}
	};

	const handleCancel = () => {
		if (card) {
			const {
				id: _id,
				createdAt: _createdAt,
				updatedAt: _updatedAt,
				...editable
			} = card;
			setCardData(editable);
		}
	};

	const handleDelete = () => {
		deleteCard(id);
		navigate(`/boards/${card?.boardId}`);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				pl: leftEdgeOffset,
				gap: 2,
				minHeight: "100vh",
			}}
		>
			<CardActionBar
				card={card as Card}
				cardData={cardData}
				board={board as Board}
			/>
			<TextField
				id={titleInputId}
				variant="standard"
				value={cardData.title}
				onChange={(e) =>
					setCardData((prev) => ({ ...prev, title: e.target.value }))
				}
				fullWidth
				slotProps={{
					input: {
						disableUnderline: true,
						sx: (theme) => ({
							...theme.typography.h4,
							fontWeight: "bold",
							padding: 0,
							margin: 0,
						}),
					},
				}}
			/>
			<Divider sx={{ ml: -leftEdgeOffset }} />
			<CardEditControls
				board={board}
				cardData={cardData}
				setCardData={setCardData}
				prioritySelectId={prioritySelectId}
				columnSelectId={columnSelectId}
				handleDelete={handleDelete}
			/>
			<Divider sx={{ ml: -leftEdgeOffset }} />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						flex: 1,
						overflow: "auto",
						mt: 3,
						mr: 3,
						pt: 2,
					}}
				>
					<TextField
						id={bodyInputId}
						label="Notes"
						value={cardData.body}
						onChange={(e) =>
							setCardData((prev) => ({ ...prev, body: e.target.value }))
						}
						multiline
						minRows={10}
						fullWidth
					/>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
					<Button
						variant="contained"
						color="warning"
						sx={{ mr: 2 }}
						onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleSave}>
						Save Changes
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
