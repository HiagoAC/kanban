import {
	Add as AddIcon,
	DragIndicator as DragIndicatorIcon,
	MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useId } from "react";
import type { Column } from "../types";

interface ColumnViewProps {
	column: Column;
}

export function ColumnView({ column }: ColumnViewProps) {
	const moreButtonId = useId();
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
					<IconButton id={moreButtonId}>
						<MoreHorizIcon fontSize="small" />
					</IconButton>
				</Stack>
			</Stack>
		</Stack>
	);
}
