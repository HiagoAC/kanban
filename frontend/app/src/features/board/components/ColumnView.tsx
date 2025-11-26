import {
	Add as AddIcon,
	DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useId } from "react";
import type { Board, Column } from "../types";
import { ColumnOptionsMenu } from "./ColumnOptionsMenu";

interface ColumnViewProps {
	column: Column;
	board: Board;
}

export function ColumnView({ column, board }: ColumnViewProps) {
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
					<IconButton id={addButtonId}>
						<AddIcon fontSize="small" />
					</IconButton>
					<ColumnOptionsMenu board={board} column={column} />
				</Stack>
			</Stack>
		</Stack>
	);
}
