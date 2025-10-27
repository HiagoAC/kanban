import { Layout } from "../components/Layout";

export function HomePage() {
	return (
		<Layout isHomePage={true}>
			<div>
				<h1>Home Page</h1>
			</div>
		</Layout>
	);
}
