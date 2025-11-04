import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { BoardView } from "../features/board/components/BoardView";

export function BoardPage() {
	const { id = "" } = useParams<{ id: string }>();

	return (
		<Layout>
			<BoardView id={id} />
		</Layout>
	);
}
