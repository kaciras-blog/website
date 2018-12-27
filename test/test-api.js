import { BasicApiFactory } from "../src/api";
import axios from "axios";


describe("api factory", function () {

	const m = axios.create();
	m.patch = jest.fn(() => Promise.resolve());
	const api = new BasicApiFactory({ mainServer: m });

	afterEach(() => {
		m.patch.mockClear();
	});

	it("should pass arguments", async () => {
		await api.article.remove(123);

		expect(m.patch.mock.calls[0][0]).toBe("/articles/123");
		expect(m.patch.mock.calls[0][1].deletion).toBe(true);
	});

	it("should touch CencelToken", async function () {
		const cancelToken = axios.CancelToken.source().token;
		await api.withCancelToken(cancelToken).article.remove(123);

		expect(m.patch.mock.calls[0][2].cancelToken).toBe(cancelToken);
	});

	it("should touch principle", async function () {
		const requestStub = {
			headers: {
				cookie: "test cookie",
			},
			cookies: {
				get: (name) => name + ": test csrf token",
			},
		};
		await api.withPrototype(requestStub).article.remove(123);

		const config = m.patch.mock.calls[0][2];
		expect(config.headers.Cookie).toBe("test cookie");
		expect(config.headers["X-CSRF-Token"]).toBe("CSRF-Token: test csrf token");
	});

	it("should accept undefined", async function () {
		await api.withPrototype(undefined).article.remove(123);
		await api.withCancelToken(undefined).article.remove(123);
	});
});
