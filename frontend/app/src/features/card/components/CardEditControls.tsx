import DeleteIcon from "@mui/icons-material/Delete";
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { Board } from "../../board/types";
import type { Card, Priority } from "../types";
import { PRIORITY_OPTIONS } from "../types";
import { DeleteCardDialogue } from "./DeleteCardDialogue";
import { PrioritySelectDisplay } from "./PrioritySelectDisplay";

interface CardEditControlsProps {
	board: Board | undefined;
	cardData: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>;
	setCardData: React.Dispatch<
		React.SetStateAction<Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>>
	>;
	prioritySelectId: string;
	columnSelectId: string;
	handleDelete: () => void;
}

export function CardEditControls({
	board,
	cardData,
	setCardData,
	prioritySelectId,
	columnSelectId,
	handleDelete,
}: CardEditControlsProps) {
	const [openDelete, setOpenDelete] = useState(false);

	return (
		<Stack
			direction="row"
			spacing={4}
			sx={{
				flexWrap: "wrap",
			}}
		>
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
			{cardData.columnId && (
				<Button
					onClick={() => setOpenDelete(true)}
					startIcon={<DeleteIcon />}
					variant="outlined"
					color="error"
				>
					<Typography variant="body2">Delete Card</Typography>
				</Button>
			)}
			<DeleteCardDialogue
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				cardData={cardData}
				handleDelete={handleDelete}
			/>
		</Stack>
	);
}
