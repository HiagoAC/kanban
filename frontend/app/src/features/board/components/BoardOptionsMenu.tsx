import { useState } from "react";
import { OptionsMenu } from "../../../components/OptionsMenu";
import { RenameDialogue } from "../../../components/RenameDialogue";
import { useUpdateBoard } from "../hooks/useUpdateBoard";
import type { Board } from "../types";
import { AddColumnDialogue } from "./AddColumnDialogue";
import { DeleteBoardDialogue } from "./DeleteBoardDialogue";

interface BoardOptionsMenuProps {
	board: Board;
}

export function BoardOptionsMenu({ board }: BoardOptionsMenuProps) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [addColumnOpen, setAddColumnOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const { mutate: updateBoard } = useUpdateBoard();

	return (
		<>
			<OptionsMenu
				items={[
					{ label: "Rename Board", onClick: () => setRenameOpen(true) },
					{ label: "Add Column", onClick: () => setAddColumnOpen(true) },
					{ label: "Delete Board", onClick: () => setDeleteOpen(true) },
				]}
			/>
			<RenameDialogue
				open={renameOpen}
				onClose={() => setRenameOpen(false)}
				dialogueTitle="Rename Board"
				onSubmit={(title) =>
					updateBoard({ id: board.id, boardData: { title: title } })
				}
			/>
			<AddColumnDialogue
				open={addColumnOpen}
				onClose={() => setAddColumnOpen(false)}
				board={board}
			/>
			<DeleteBoardDialogue
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				board={board}
			/>
		</>
	);
}
