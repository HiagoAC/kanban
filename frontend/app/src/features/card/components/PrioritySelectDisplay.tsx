import { Box, Typography } from "@mui/material";
import type { Priority } from "../types";
import { PriorityDot } from "./PriorityDot";

export function PrioritySelectDisplay({ priority }: { priority: Priority }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
			<PriorityDot priority={priority} />
			<Typography>
				{priority.charAt(0).toUpperCase() + priority.slice(1)}
			</Typography>
		</Box>
	);
}
