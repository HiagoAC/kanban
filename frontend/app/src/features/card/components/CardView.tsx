import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import {
	Box,
	Button,
	ButtonBase,
	Divider,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBoard } from "../../board/hooks/useGetBoard";
import { useGetCard } from "../hooks/useGetCard";
import { useUpdateCard } from "../hooks/useUpdateCard";
import type { Card, Priority } from "../types";
import { PRIORITY_OPTIONS } from "../types";
import { PrioritySelectDisplay } from "./PrioritySelectDisplay";

export function CardView({ id }: { id: string }) {
	const { data: card, isLoading } = useGetCard(id);
	const boardId = card?.boardId;
	const { data: board } = useGetBoard(boardId);
	const [cardData, setCardData] = useState<
		Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>
	>({});
	const { mutate: updateCard } = useUpdateCard();

	const titleInputId = useId();
	const columnSelectId = useId();
	const prioritySelectId = useId();
	const bodyInputId = useId();

	const leftEdgeOffset = 4;

	const navigate = useNavigate();

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
			<ButtonBase
				onClick={() => navigate(`/boards/${card?.boardId}`)}
				sx={{
					height: "auto",
					boxSizing: "border-box",
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					alignSelf: "flex-start",
					width: "auto",
				}}
			>
				<KeyboardDoubleArrowLeftIcon />
				<Typography variant="body2" sx={{ alignSelf: "center", ml: 1 }}>
					{board?.title} /{" "}
					{
						board?.columns.find((column) => column.id === cardData?.columnId)
							?.title
					}
				</Typography>
			</ButtonBase>
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
			{board && cardData.columnId && (
				<Stack direction="row">
					<Typography variant="body1" sx={{ alignSelf: "center", mr: 2 }}>
						Priority:
					</Typography>
					<TextField
						id={prioritySelectId}
						select
						variant="standard"
						value={cardData.priority}
						onChange={(e) =>
							setCardData((prev) => ({
								...prev,
								priority: e.target.value as Priority,
							}))
						}
						sx={{
							"& .MuiSelect-select": {
								display: "flex",
								alignItems: "center",
								gap: 1,
							},
						}}
						slotProps={{
							select: {
								renderValue: (value) =>
									value ? (
										<PrioritySelectDisplay priority={value as Priority} />
									) : null,
							},
						}}
					>
						{PRIORITY_OPTIONS.map((option) => (
							<MenuItem key={option} value={option}>
								<PrioritySelectDisplay priority={option} />
							</MenuItem>
						))}
					</TextField>
				</Stack>
			)}
			{board && cardData.columnId && (
				<Stack direction="row">
					<Typography variant="body1" sx={{ alignSelf: "center", mr: 2 }}>
						Column:
					</Typography>
					<TextField
						id={columnSelectId}
						select
						variant="standard"
						value={cardData.columnId}
						onChange={(e) =>
							setCardData((prev) => ({ ...prev, columnId: e.target.value }))
						}
					>
						{board?.columns.map((column) => (
							<MenuItem key={column.id} value={column.id}>
								{column.title}
							</MenuItem>
						))}
					</TextField>
				</Stack>
			)}
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
