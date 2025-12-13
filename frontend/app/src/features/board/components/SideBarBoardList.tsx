import StarIcon from "@mui/icons-material/Star";
import { List, ListItem } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SideBarListButton } from "../../../components/SideBarListButton";
import { useFetchBoards } from "../hooks/useFetchBoards";

export function SideBarBoardList() {
	const navigate = useNavigate();
	const query = useFetchBoards();

	const sortedBoards = useMemo(() => {
		return query.data
			?.slice()
			.sort((a, b) => Number(b.starred) - Number(a.starred));
	}, [query.data]);

	if (query.isLoading) {
		return <div data-testid="loading">Loading...</div>;
	}

	if (query.isError) {
		return <div data-testid="error">Error loading boards</div>;
	}

	return (
		<List>
			{sortedBoards?.map((board) => (
				<ListItem key={board.id} disablePadding>
					<SideBarListButton
						onClick={() => navigate(`/boards/${board.id}`)}
						text={board.title}
						icon={board.starred ? <StarIcon fontSize="small" /> : null}
					/>
				</ListItem>
			))}
		</List>
	);
}
