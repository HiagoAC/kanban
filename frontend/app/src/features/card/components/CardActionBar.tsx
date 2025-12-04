import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { AppBar, Box, ButtonBase, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeAgo from "react-timeago";
import type { Board } from "../../board/types";
import type { Card } from "../types";

interface CardActionBarProps {
	card: Card;
	cardData: Partial<Omit<Card, "id" | "createdAt" | "updatedAt">>;
	board: Board;
}

export function CardActionBar({ card, cardData, board }: CardActionBarProps) {
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setHasUnsavedChanges(
			Object.entries(cardData).some(([key, value]) =>
				card ? value !== card[key as keyof Card] : false,
			),
		);
	}, [cardData, card]);

	return (
		<AppBar
			position="static"
			sx={{
				height: "auto",
				minHeight: 0,
				m: 0,
				p: 0,
				boxShadow: "none",
				bgcolor: "transparent",
				color: "black",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					height: "auto",
					minHeight: 0,
					m: 0,
					pr: 1,
					pt: 1,
				}}
			>
				<ButtonBase
					onClick={() => navigate(`/boards/${card?.boardId}`)}
					sx={{
						height: "auto",
						boxSizing: "border-box",
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-start",
						alignSelf: "flex-start",
						width: "auto",
					}}
				>
					<KeyboardDoubleArrowLeftIcon />
					<Typography variant="body2" sx={{ alignSelf: "center", ml: 1 }}>
						{board?.title} /{" "}
						{
							board?.columns.find((column) => column.id === cardData?.columnId)
								?.title
						}
					</Typography>
				</ButtonBase>
				<Box sx={{ flexGrow: 1 }} />
				<Box
					sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
				>
					{hasUnsavedChanges && (
						<Typography variant="body1" sx={{ mx: 1 }}>
							{"You have unsaved changes!  |  "}
						</Typography>
					)}
					<Typography variant="body1" component="div">
						Edited <TimeAgo date={card.updatedAt} />
					</Typography>
				</Box>
			</Box>
		</AppBar>
	);
}
