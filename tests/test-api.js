import { BasicApiFactory } from "../src/api/support";
import axios from "axios";

class TestApi {

	constructor(axiosSet) {
		this.mainServer = axiosSet.mainServer;
	}

	updateDeletion(id, deletion) {
		return this.mainServer.patch(`/articles/${id}`, { deletion });
	}
}

describe("api factory", () => {

	beforeAll(() => BasicApiFactory.registerApi("_test", TestApi));
	afterAll(() => delete BasicApiFactory.prototype._test);

	const m = axios.create();
	m.patch = jest.fn(() => Promise.resolve());
	const api = new BasicApiFactory({ mainServer: m });

	afterEach(() => {
		m.patch.mockClear();
	});

	it("should pass arguments", async () => {
		await api._test.updateDeletion(123, true);

		expect(m.patch.mock.calls[0][0]).toBe("/articles/123");
		expect(m.patch.mock.calls[0][1].deletion).toBe(true);
	});

	it("should touch CancelToken", async () => {
		const cancelToken = axios.CancelToken.source().token;
		await api.withCancelToken(cancelToken)._test.updateDeletion(123, true);

		expect(m.patch.mock.calls[0][2].cancelToken).toBe(cancelToken);
	});

	it("should touch principle", async () => {
		const requestStub = {
			headers: {
				cookie: "test cookie",
			},
			cookies: {
				get: (name) => name + ": test csrf token",
			},
		};
		await api.withPrototype(requestStub)._test.updateDeletion(123, true);

		const config = m.patch.mock.calls[0][2];
		expect(config.headers.Cookie).toBe("test cookie");
		expect(config.headers["X-CSRF-Token"]).toBe("CSRF-Token: test csrf token");
	});

	it("should accept undefined", async () => {
		await api.withPrototype(undefined)._test.updateDeletion(123, true);
		await api.withCancelToken(undefined)._test.updateDeletion(123, true);
	});
});
