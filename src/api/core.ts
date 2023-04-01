import { FetchClient, FetchClientError } from "@kaciras/utilities/browser";

/**
 * 检查下响应的状态码是否是 2xx，如果不是则抛出异常。
 *
 * <h1>异常信息的格式</h1>
 * 本项目采用 RFC 7807 Problem Details 格式的响应体。
 * https://www.rfc-editor.org/rfc/rfc7807.html
 *
 * 这个格式定义了多个可选的属性，但仅 detail 被使用。
 */
async function check(task: Promise<Response>) {
	const response = await task;
	if (response.ok) {
		return response;
	}
	const { detail } = await response.json();
	throw new FetchClientError(response, detail);
}

type EndpointMap = Record<string | symbol, typeof FetchClient>;

type APIDefs = Record<string | symbol, EndpointMap>;

type FlatEndpoints<T extends EndpointMap> = { [K in keyof T]: [K, T[K]] }[keyof T];

type FlatDefs<T extends APIDefs> = { [K in keyof T]: FlatEndpoints<T[K]> }[keyof T];

type APIMap<T extends APIDefs> = {

	// 这里用 Omit 移除了 FetchClient 自身的方法。
	[P in FlatDefs<T> as P[0]]: Omit<InstanceType<P[1]>, keyof FetchClient>;
} & {

	/**
	 * 修改 API 请求的基本配置，比如设置 AbortSignal、更改请求头等等。
	 * 基本配置会传递到每个 `fetch` 请求中。
	 *
	 * @example
	 * import api from "@/api/index";
	 *
	 * // 禁止 API 请求发送 Cookie
	 * const anonymousAPI = api.configure({ credentials: "omit" });
	 * await anonymousAPI.user.getCurrent(); // 404，没有登录
	 * await anonymousAPI.config.set(...);   // 403，游客没有权限
	 *
	 * @param changes 要合并的请求配置
	 * @return 新的 APIMap 对象，带有修改后的配置，原对象不受影响。
	 */
	configure(changes: RequestInit): APIMap<T>;
};

type Factories = Record<string | symbol, (init: RequestInit) => FetchClient>;

class APIFactoryHandler implements ProxyHandler<Factories> {

	private readonly base: RequestInit;

	constructor(base: RequestInit) {
		this.base = base;
	}

	configure(target: Factories, init: RequestInit) {
		init = {
			...this.base,
			...init,
			headers: {
				...this.base.headers,
				...init.headers,
			},
		};
		return new Proxy(target, new APIFactoryHandler(init));
	}

	get(target: Factories, property: string | symbol) {
		if (property === "configure") {
			return (init: RequestInit) => this.configure(target, init);
		}
		return target[property](this.base);
	}
}

export function defineAPIs<T extends APIDefs>(defs: T): APIMap<T> {
	const factories: any = {};
	for (const baseURL of Object.keys(defs)) {
		for (const name of Object.keys(defs[baseURL])) {
			const EP = defs[baseURL][name];
			factories[name] = (init: RequestInit) => new EP({ baseURL, init, check });
		}
	}
	return new Proxy(factories, new APIFactoryHandler({}));
}
