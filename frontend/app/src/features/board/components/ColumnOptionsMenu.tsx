import { useState } from "react";
import type { Board, Column } from "../types";
import { useUpdateColumnInBoard } from "../hooks/useUpdateColumnInBoard";
import { DeleteColumnDialogue } from "./DeleteColumnDialogue";
import { OptionsMenu } from "../../../components/OptionsMenu";
import { RenameDialogue } from "../../../components/RenameDialogue";

interface ColumnOptionsMenuProps {
	board: Board;
	column: Column;
}

export function ColumnOptionsMenu({ board, column }: ColumnOptionsMenuProps) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

    const { mutate: updateColumnInBoard } = useUpdateColumnInBoard();

	return (
		<>
			<OptionsMenu
				items={[
					{ label: "Rename Column", onClick: () => setRenameOpen(true) },
					{ label: "Delete Column", onClick: () => setDeleteOpen(true) },
				]}
                iconSize="small"
			/>
            <RenameDialogue
                open={renameOpen}
                onClose={() => setRenameOpen(false)}
                dialogueTitle="Rename Column"
                onSubmit={(title: string) =>
                    updateColumnInBoard({
						boardId: board.id,
						columnId: column.id,
						columnData: { title: title }
					})
                }
            />
			<DeleteColumnDialogue
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				board={board}
				column={column}
			/>
		</>
	);
}
