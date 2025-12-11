import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
	executeDragMove,
	updateItemsOrder,
} from "../../../utils/drag-and-drop";
import { useGetBoard } from "../hooks/useGetBoard";
import { useMoveColumnBefore } from "../hooks/useMoveColumnBefore";
import { useMoveColumnEnd } from "../hooks/useMoveColumnEnd";
import type { Column } from "../types";
import { BoardActionBar } from "./BoardActionBar";
import { ColumnView } from "./ColumnView";
import { SortableColumn } from "./SortableColumn";

export function BoardView({ id }: { id: string }) {
	const { data: board, isLoading } = useGetBoard(id);
	const [columns, setColumns] = useState<Column[]>([]);
	const { mutate: moveColumnBefore } = useMoveColumnBefore();
	const { mutate: moveColumnEnd } = useMoveColumnEnd();

	useEffect(() => {
		if (board?.columns) {
			setColumns(board.columns);
		}
	}, [board?.columns]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const boardId = board?.id || "";

		const shouldUpdate = executeDragMove(event, columns, {
			moveItemAbove: ({ itemId, targetItemId }) =>
				moveColumnBefore({
					columnId: itemId,
					boardId,
					targetColumnId: targetItemId,
				}),
			moveItemBottom: ({ itemId }) =>
				moveColumnEnd({ columnId: itemId, boardId }),
		});

		if (shouldUpdate) {
			setColumns((items) =>
				updateItemsOrder(items, event.active.id, event.over?.id),
			);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 100,
					backgroundColor: "background.default",
					width: "100%",
					height: "auto",
					boxSizing: "border-box",
					pl: 2,
					py: 1,
				}}
			>
				<Typography
					variant="h4"
					fontWeight="bold"
					sx={{ flex: 1, minWidth: 0, alignSelf: "end" }}
				>
					{board?.title}
				</Typography>
				<Box sx={{ flexShrink: 0 }}>
					{board && <BoardActionBar board={board} />}
				</Box>
			</Stack>
			<DndContext onDragEnd={handleDragEnd}>
				<SortableContext items={board?.columns || []}>
					<Stack
						className="auto-hide-scrollbar"
						direction="row"
						sx={{
							overflow: "auto",
							flex: 1,
							minWidth: "100%",
							boxSizing: "border-box",
							p: 2,
						}}
					>
						{board &&
							columns.map((column, index) => (
								<SortableColumn key={column.id} id={column.id}>
									{({ dragListeners }) => (
										<ColumnView
											column={column}
											board={board}
											prevColumnId={
												index > 0 ? columns[index - 1].id : undefined
											}
											nextColumnId={
												index < columns.length - 1
													? columns[index + 1].id
													: undefined
											}
											dragListeners={dragListeners}
										/>
									)}
								</SortableColumn>
							))}
					</Stack>
				</SortableContext>
			</DndContext>
		</Box>
	);
}
