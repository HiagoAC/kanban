// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Layout } from "../Layout";

describe("Layout", () => {
	it("renders children correctly", () => {
		const testContent = <div data-testid="test-content">Custom Content</div>;
		render(<Layout>{testContent}</Layout>);
		expect(screen.getByTestId("test-content")).not.toBeNull();
	});
});
