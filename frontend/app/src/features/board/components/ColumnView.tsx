import {
	Add as AddIcon,
	DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
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
}

export function ColumnView({ column, board, prevColumnId, nextColumnId }: ColumnViewProps) {
	const [createCardOpen, setCreateCardOpen] = useState(false);
	const addButtonId = useId();

	return (
		<Stack
			direction="column"
			sx={{
				border: "2px solid black",
				borderRadius: 2,
				minWidth: 300,
				alignSelf: "stretch",
				mr: 2,
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				mb={2}
			>
				<Stack direction="row">
					<IconButton>
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
			<CardStack
				columnId={column.id}
				prevColumnId={prevColumnId}
				nextColumnId={nextColumnId}
			/>
		</Stack>
	);
}
