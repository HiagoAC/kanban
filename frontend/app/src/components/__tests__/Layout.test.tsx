// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { Layout } from "../Layout";

vi.mock("../SideBar", () => ({
	SideBar: () => <div data-testid="mock-sidebar" />,
}));

describe("Layout", () => {
	it("renders children correctly", () => {
		const testContent = <div data-testid="test-content">Custom Content</div>;
		render(
			<MemoryRouter>
				<Layout>{testContent}</Layout>
			</MemoryRouter>,
		);
		expect(screen.getByTestId("test-content")).not.toBeNull();
	});
});
