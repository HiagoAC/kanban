import CircleIcon from "@mui/icons-material/Circle";
import type { Priority } from "../types";

const priorityColorOptions = {
  high: "error",
  medium: "warning",
  low: "info",
} as const;

export function PriorityDot({ priority }: { priority?: Priority }) {
  const color = priority ? priorityColorOptions[priority] : "primary";

  return <CircleIcon sx={{ fontSize: 12 }} color={color} />;
}
