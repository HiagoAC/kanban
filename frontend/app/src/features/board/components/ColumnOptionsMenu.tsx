import { useState } from "react";
import type { Column } from "../types";
import { useUpdateColumnInBoard } from "../hooks/useUpdateColumnInBoard";
import { RenameDialogue } from "../../../components/RenameDialogue";
import { OptionsMenu } from "../../../components/OptionsMenu";

interface ColumnOptionsMenuProps {
	boardId: string;
	column: Column;
}

export function ColumnOptionsMenu({ boardId, column }: ColumnOptionsMenuProps) {
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
                onSubmit={(title) =>
                    updateColumnInBoard({ boardId, columnId: column.id, columnData: { title: title } })
                }
            />
		</>
	);
}
