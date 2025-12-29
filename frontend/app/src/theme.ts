import { createTheme } from "@mui/material/styles";

export const pageBg = "#FAFBFC";
export const backgroundSecondary = "#E7EBF0";
export const sidebarHover = "#D1D5DB";

export const columnBg = "#D1D5DB";

export const cardBg = "#FAFBFC";
export const cardHover = "#E5E7EB";
export const borderColor = "#E2E8F0";

export const theme = createTheme({
	palette: {
		mode: "light",

		background: {
			default: pageBg,
			paper: cardBg,
		},

		primary: {
			main: "#374151",
			dark: "#1F2937",
			contrastText: "#FFFFFF",
		},

		text: {
			primary: "#1F2937",
			secondary: "#4B5563",
			disabled: "#9CA3AF",
		},

		divider: borderColor,

		action: {
			hover: cardHover,
			selected: "#D1D5DB",
		},
	},

	typography: {
		fontFamily: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,

		h1: { fontWeight: 600, color: "#1F2937" },
		h2: { fontWeight: 600, color: "#1F2937" },
		h3: { fontWeight: 600, color: "#1F2937" },

		body1: { color: "#1F2937" },
		body2: { color: "#4B5563" },
	},

	shape: {
		borderRadius: 8,
	},

	components: {
		/* Cards */
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundColor: cardBg,
					border: `1px solid ${borderColor}`,
					boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
				},
			},
		},

		/* Papers (columns, panels) */
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
				},
			},
		},

		/* Sidebar / list buttons */
		MuiListItemButton: {
			styleOverrides: {
				root: {
					borderRadius: 6,
					"&.Mui-selected": {
						backgroundColor: "#D1D5DB",
						"&:hover": {
							backgroundColor: "#D1D5DB",
						},
					},
					"&:hover": {
						backgroundColor: sidebarHover,
					},
				},
			},
		},
	},
});
