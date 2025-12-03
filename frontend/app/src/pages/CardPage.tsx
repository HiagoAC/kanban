import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CardView } from "../features/card/components/CardView";

export function CardPage() {
	const { id = "" } = useParams<{ id: string }>();

	return (
		<Layout>
			<CardView id={id} />
		</Layout>
	);
}
