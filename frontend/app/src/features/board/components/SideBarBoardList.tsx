import StarIcon from "@mui/icons-material/Star";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SideBarListButton } from "../../../components/SideBarListButton";
import { useActiveBoard } from "../contexts/ActiveBoardContext";
import { useFetchBoards } from "../hooks/useFetchBoards";
import { generateDisplayTitles } from "../utils/displayTitleUtils";

export function SideBarBoardList() {
	const navigate = useNavigate();
	const query = useFetchBoards();
	const { activeBoardId } = useActiveBoard();
	const sortedBoards = useMemo(() => {
		return query.data?.slice().sort((a, b) => {
			const starredDiff = Number(b.starred) - Number(a.starred);
			if (starredDiff !== 0) {
				return starredDiff;
			}
			return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
		});
	}, [query.data]);

	const displayTitles = useMemo(() => {
		return query.data ? generateDisplayTitles(query.data) : new Map();
	}, [query.data]);

	if (query.isLoading) {
		return <div data-testid="loading">Loading...</div>;
	}

	if (query.isError) {
		return <div data-testid="error">Error loading boards</div>;
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Typography
				variant="subtitle1"
				sx={{ m: 2, fontWeight: "bold", flexShrink: 0 }}
			>
				Boards
			</Typography>
			<Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
				<List sx={{ py: 0 }}>
					{sortedBoards?.map((board) => (
						<ListItem key={board.id} disablePadding sx={{ my: 0 }}>
							<SideBarListButton
								onClick={() => navigate(`/boards/${board.id}`)}
								text={displayTitles.get(board.id) || board.title}
								icon={board.starred ? <StarIcon fontSize="small" /> : null}
								selected={activeBoardId === board.id}
							/>
						</ListItem>
					))}
				</List>
			</Box>
		</Box>
	);
}
