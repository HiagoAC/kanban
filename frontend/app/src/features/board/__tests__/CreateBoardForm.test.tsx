// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateBoardForm } from "../components/CreateBoardForm";
import { useCreateBoards } from "../hooks/useCreateBoards";

vi.mock("../hooks/useCreateBoards");
const mockMutate = vi.fn();

describe("CreateBoardForm", () => {
	afterEach(() => {
		cleanup();
	});
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(useCreateBoards).mockReturnValue({
			mutate: mockMutate,
		} as unknown as ReturnType<typeof useCreateBoards>);
	});

	it("updates list properly when a column is added", async () => {
		render(
			<MemoryRouter>
				<CreateBoardForm />
			</MemoryRouter>,
		);

		const user = userEvent.setup();
		const columnInput = screen.getByRole("textbox", { name: /add column/i });
		await user.type(columnInput, "New Column 1");

		const addColumnButton = screen.getByTestId("add-column-button");
		await user.click(addColumnButton);

		await user.type(columnInput, "New Column 2");
		await user.click(addColumnButton);

		const newColumn1 = await screen.findByText(/new column 1/i);
		expect(newColumn1).not.toBeNull();

		const newColumn2 = await screen.findByText(/new column 2/i);
		expect(newColumn2).not.toBeNull();
	});

	it("removes a column when the delete button is clicked", async () => {
		render(
			<MemoryRouter>
				<CreateBoardForm />
			</MemoryRouter>,
		);

		const user = userEvent.setup();
		const columnInput = screen.getByRole("textbox", { name: /add column/i });
		await user.type(columnInput, "Column to be removed");

		const addColumnButton = screen.getByTestId("add-column-button");
		await user.click(addColumnButton);

		await user.type(columnInput, "Another Column");
		await user.click(addColumnButton);

		const columnToRemove = await screen.getByText(/column to be removed/i);
		expect(columnToRemove).not.toBeNull();

		const deleteButton = await screen.getByTestId(
			"delete-column-button-Column to be removed",
		);
		await user.click(deleteButton);

		expect(screen.queryByText(/column to be removed/i)).toBeNull();
		const anotherColumn = await screen.getByText(/another column/i);
		expect(anotherColumn).not.toBeNull();
	});

	it("submits the form with correct data", async () => {
		const user = userEvent.setup();

		render(
			<MemoryRouter>
				<CreateBoardForm />
			</MemoryRouter>,
		);

		const titleInput = screen.getByLabelText(/kanban board title/i);
		await user.type(titleInput, "Project X");
		const columnInput = screen.getByTestId("column-input");
		await user.type(columnInput, "Review");
		const addColumnButton = screen.getByTestId("add-column-button");
		await user.click(addColumnButton);

		const submitButton = screen.getByRole("button", {
			name: /create kanban board/i,
		});
		await user.click(submitButton);

		expect(mockMutate).toHaveBeenCalledWith({
			title: "Project X",
			columns: ["To Do", "In Progress", "Done", "Review"],
		});

		expect(mockMutate).toHaveBeenCalledTimes(1);
	});
});
