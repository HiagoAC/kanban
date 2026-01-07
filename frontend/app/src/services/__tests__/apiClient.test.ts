import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCookie } from "../../utils/cookies";

vi.mock("axios");
vi.mock("../../utils/cookies");

const mockedAxios = vi.mocked(axios);
const mockedGetCookie = vi.mocked(getCookie);

let requestInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig;
let responseInterceptor: (response: AxiosResponse) => AxiosResponse;

const mockAxiosInstance = {
	interceptors: {
		request: {
			use: vi.fn((fn) => {
				requestInterceptor = fn;
			}),
		},
		response: {
			use: vi.fn((fn) => {
				responseInterceptor = fn;
			}),
		},
	},
};

describe("apiClient interceptors", () => {
	beforeEach(async () => {
		vi.clearAllMocks();

		mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);

		// Import apiClient after mocks so interceptors are registered
		await import("../apiClient");
	});

	it("converts request data to snake_case for JSON requests", () => {
		const config = {
			headers: { "Content-Type": "application/json" },
			data: { firstName: "John", lastName: "Doe" },
		};

		const result = requestInterceptor(config);

		expect(result.data).toEqual({
			first_name: "John",
			last_name: "Doe",
		});
	});

	it("converts response data to camelCase", () => {
		const response = {
			data: { first_name: "John", last_name: "Doe" },
			// biome-ignore lint/suspicious/noExplicitAny: Test mock requires any type
		} as any;

		const result = responseInterceptor(response);

		expect(result.data).toEqual({
			firstName: "John",
			lastName: "Doe",
		});
	});

	it("adds CSRF token to headers when cookie exists", () => {
		mockedGetCookie.mockReturnValue("test-csrf-token");

		const config = {
			headers: { "Content-Type": "application/json" },
			data: {},
		};

		const result = requestInterceptor(config);

		expect(mockedGetCookie).toHaveBeenCalledWith("csrftoken");
		expect(result.headers?.["X-CSRFToken"]).toBe("test-csrf-token");
	});
});
