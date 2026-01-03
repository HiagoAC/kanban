// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BASE_URL } from "../../../services/apiClient";
import { signInWithGoogle } from "../services";

describe("signInWithGoogle", () => {
	let assignMock: ReturnType<typeof vi.fn>;
	let originalLocation: Location;

	beforeEach(() => {
		assignMock = vi.fn();
		originalLocation = window.location;
		Object.defineProperty(window, "location", {
			value: {
				...originalLocation,
				assign: assignMock,
			},
			writable: true,
		});
	});

	afterEach(() => {
		Object.defineProperty(window, "location", {
			value: originalLocation,
			writable: true,
		});
		vi.clearAllMocks();
	});

	it("should call window.location.assign with Google OAuth URL", () => {
		signInWithGoogle();

		expect(assignMock).toHaveBeenCalledOnce();
		expect(assignMock).toHaveBeenCalledWith(
			`${BASE_URL}social-auth/login/google-oauth2/`,
		);
	});

	it("should not throw any errors", () => {
		expect(() => signInWithGoogle()).not.toThrow();
	});
});
