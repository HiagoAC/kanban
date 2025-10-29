import { Divider, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetchBoards } from "../hooks/useFetchBoards";
import { SideBarListButton } from "../../../components/SideBarListButton";


export function SideBarBoardList() {

	const navigate = useNavigate();
	const query = useFetchBoards();

	if (query.isLoading) {
		return <div data-testid="loading">Loading...</div>;
	}

	if (query.isError) {
		return <div data-testid="error">Error loading boards</div>;
	}

	return (
		<List>
			{query.data!.map((board) => (
				<ListItem key={board.id} disablePadding>
					<SideBarListButton
						onClick={() => navigate(`/boards/${board.id}`)}
						text={board.title}
					/>
				</ListItem>
			))}
			<Divider variant="inset" component="li" />
		</List>
	);
}
