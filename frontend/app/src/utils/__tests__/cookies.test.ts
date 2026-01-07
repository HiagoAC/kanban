import { beforeEach, describe, expect, it } from "vitest";
import { getCookie } from "../cookies";

Object.defineProperty(global, "document", {
	value: {
		cookie: "",
	},
	writable: true,
});

const setCookie = (cookieString: string) => {
	// biome-ignore lint: Direct assignment is acceptable in tests
	document.cookie = cookieString;
};

describe("getCookie", () => {
	beforeEach(() => {
		setCookie("");
	});

	it("returns correct value when cookie exists", () => {
		setCookie("name=value; other=test");
		expect(getCookie("name")).toBe("value");
	});

	it("returns null when cookie does not exist", () => {
		setCookie("other=test; another=value");
		expect(getCookie("nonexistent")).toBe(null);
	});

	it("handles empty cookie string", () => {
		setCookie("");
		expect(getCookie("any")).toBe(null);
	});

	it("does not match partial cookie names, exact cookie name only", () => {
		setCookie("usertoken=wrong; token=correct; tokendata=alsowrong");
		expect(getCookie("token")).toBe("correct");
	});

	it("handles empty cookie value", () => {
		setCookie("empty=; filled=hasvalue");
		expect(getCookie("empty")).toBe("");
	});
});
