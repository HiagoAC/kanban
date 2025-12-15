import { Layout } from "../components/Layout";
import { LatestBoard } from "../features/board/components/LatestBoard";

export function HomePage() {
	return (
		<Layout isHomePage={true}>
			<LatestBoard />
		</Layout>
	);
}
