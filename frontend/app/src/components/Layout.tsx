import { Box, Grid } from "@mui/material";
import { ActiveBoardProvider } from "../features/board/contexts/ActiveBoardContext";
import { sidebarBg } from "../theme";
import { SideBar } from "./SideBar";

export interface Props {
	children: React.ReactNode;
	isHomePage?: boolean;
}

export function Layout({ children, isHomePage = false }: Props) {
	const collapseStyle = { display: { xs: "none", md: "block" } };
	const sideBarStyle = {
		...(isHomePage ? {} : collapseStyle),
		backgroundColor: sidebarBg,
		minHeight: "100vh",
	};
	const contentStyle = {
		...(isHomePage ? collapseStyle : {}),
		minHeight: "100vh",
	};
	const sideBarXsSize = isHomePage ? 12 : 0;
	const contentXsSize = isHomePage ? 12 : 12;

	return (
		<ActiveBoardProvider>
			<Box sx={{ flexGrow: 1, m: 0, p: 0 }}>
				<Grid container spacing={2}>
					<Grid
						size={{ md: 2.5, lg: 2, xs: sideBarXsSize }}
						sx={sideBarStyle}
						data-testid="sidebar-grid"
					>
						<SideBar />
					</Grid>
					<Grid
						size={{ md: 9.5, lg: 10, xs: contentXsSize }}
						sx={contentStyle}
						data-testid="content-grid"
					>
						{children}
					</Grid>
				</Grid>
			</Box>
		</ActiveBoardProvider>
	);
}
