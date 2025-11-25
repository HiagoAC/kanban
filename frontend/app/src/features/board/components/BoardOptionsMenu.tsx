import { useState } from "react";
import { OptionsMenu } from "../../../components/OptionsMenu";
import type { Board } from "../types";
import { AddColumnDialogue } from "./AddColumnDialogue";
import { DeleteBoardDialogue } from "./DeleteBoardDialogue";
import { RenameBoardDialogue } from "./RenameBoardDialogue";

interface BoardOptionsMenuProps {
	board: Board;
}

export function BoardOptionsMenu({ board }: BoardOptionsMenuProps) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [addColumnOpen, setAddColumnOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<OptionsMenu
				items={[
					{ label: "Rename Board", onClick: () => setRenameOpen(true) },
					{ label: "Add Column", onClick: () => setAddColumnOpen(true) },
					{ label: "Delete Board", onClick: () => setDeleteOpen(true) },
				]}
			/>
			<RenameBoardDialogue
				open={renameOpen}
				onClose={() => setRenameOpen(false)}
				boardId={board.id}
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
