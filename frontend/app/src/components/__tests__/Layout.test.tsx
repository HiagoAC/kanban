// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Layout } from "../Layout";

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
