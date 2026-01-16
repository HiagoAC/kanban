import AddIcon from "@mui/icons-material/Add";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useId, useState } from "react";
import { useCreateBoards } from "../hooks/useCreateBoards";

export function CreateBoardForm() {
	const [formData, setFormData] = useState<{
		title: string;
		columns: string[];
	}>({
		title: "",
		columns: ["To Do", "In Progress", "Done"],
	});
	const [columnInput, setColumnInput] = useState<string>("");
	const titleInputId = useId();
	const addColumnInputId = useId();
	const { mutate: createBoard } = useCreateBoards();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		if (name !== "columns") {
			setFormData((prevData) => ({
				...prevData,
				[name]: value.trim(),
			}));
		}
	};

	const addColumn = () => {
		if (
			columnInput.trim() === "" ||
			formData.columns.includes(columnInput.trim())
		)
			return;
		setFormData((prevData) => ({
			...prevData,
			columns: [...prevData.columns, columnInput.trim()],
		}));
		setColumnInput("");
	};

	const removeColumn = (indexToRemove: number) => {
		setFormData((prevData) => ({
			...prevData,
			columns: prevData.columns.filter((_, index) => index !== indexToRemove),
		}));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createBoard(formData);
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				width: 300,
			}}
		>
			<TextField
				id={titleInputId}
				name="title"
				label="Kanban Board Title"
				placeholder="e.g. Project Launch Plan"
				variant="outlined"
				onChange={handleChange}
				required
			/>
			<TextField
				id={addColumnInputId}
				name="columns"
				label="Add Column"
				placeholder="e.g. To Review"
				value={columnInput}
				onChange={(e) => setColumnInput(e.target.value)}
				variant="outlined"
				slotProps={{
					htmlInput: {
						"data-testid": "column-input",
					},
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									data-testid="add-column-button"
									edge="end"
									onClick={addColumn}
								>
									<AddIcon />
								</IconButton>
							</InputAdornment>
						),
					},
				}}
			/>
			{formData.columns.length > 0 && (
				<Typography
					variant="body2"
					sx={{
						fontWeight: "bold",
						mb: -1,
					}}
				>
					Columns
				</Typography>
			)}
			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						{formData.columns.map((column, index) => (
							<TableRow key={column} sx={{ py: 0 }}>
								<TableCell sx={{ py: 0.5, fontSize: "0.875rem" }}>
									{column}
								</TableCell>
								<TableCell align="right" sx={{ pr: 0, py: 0.5 }}>
									<Button
										data-testid={`delete-column-button-${column}`}
										onClick={() => removeColumn(index)}
										size="small"
									>
										<CloseOutlinedIcon color="action" fontSize="small" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Button type="submit" variant="contained" color="primary">
				Create Kanban Board
			</Button>
		</Box>
	);
}
