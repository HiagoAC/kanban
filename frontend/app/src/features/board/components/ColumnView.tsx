import type { DraggableSyntheticListeners } from "@dnd-kit/core/dist/hooks/useDraggable";
import {
	Add as AddIcon,
	DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useId, useState } from "react";
import { CardStack } from "../../card/components/CardStack";
import { CreateCardDialogue } from "../../card/components/CreateCardDialogue";
import type { Board, Column } from "../types";
import { ColumnOptionsMenu } from "./ColumnOptionsMenu";

interface ColumnViewProps {
	column: Column;
	board: Board;
	prevColumnId?: string;
	nextColumnId?: string;
	dragListeners?: DraggableSyntheticListeners;
}

export function ColumnView({
	column,
	board,
	prevColumnId,
	nextColumnId,
	dragListeners,
}: ColumnViewProps) {
	const [createCardOpen, setCreateCardOpen] = useState(false);
	const addButtonId = useId();

	return (
		<Stack
			direction="column"
			sx={{
				border: "2px solid black",
				borderRadius: 2,
				minHeight: 0,
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				mb={2}
				sx={{ position: "sticky", top: 0 }}
			>
				<Stack direction="row">
					<IconButton {...dragListeners} sx={{ cursor: "grab" }}>
						<DragIndicatorIcon fontSize="small" />
					</IconButton>
					<Typography variant="subtitle1" fontWeight="bold" mb={1} pt={1}>
						{column.title}
					</Typography>
				</Stack>
				<Stack direction="row" alignSelf="center">
					<IconButton id={addButtonId} onClick={() => setCreateCardOpen(true)}>
						<AddIcon fontSize="small" />
					</IconButton>
					<ColumnOptionsMenu board={board} column={column} />

					{createCardOpen && (
						<CreateCardDialogue
							open={createCardOpen}
							onClose={() => setCreateCardOpen(false)}
							column={column}
							board={board}
						/>
					)}
				</Stack>
			</Stack>
			<Box
				className="auto-hide-scrollbar"
				sx={{
					flex: 1,
					overflow: "auto",
					px: 2,
					py: 1,
					pb: 2,
				}}
			>
				<CardStack
					columnId={column.id}
					prevColumnId={prevColumnId}
					nextColumnId={nextColumnId}
				/>
			</Box>
		</Stack>
	);
}
