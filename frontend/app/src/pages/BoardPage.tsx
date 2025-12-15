import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { BoardContainer } from "../features/board/components/BoardContainer";

export function BoardPage() {
	const { id = "" } = useParams<{ id: string }>();

	return (
		<Layout>
			<BoardContainer id={id} />
		</Layout>
	);
}
