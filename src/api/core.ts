/**
 * HTTP 请求成功，但返回的响应不符合预期，比如状态码非 2xx 时抛出的异常。
 */
export class BlogAPIError extends Error {

	/** 原始的响应 */
	readonly response: Response;

	/** 状态码，等于 response.status */
	readonly code: number;

	constructor(response: Response, message: string) {
		super(message);
		this.response = response;
		this.code = response.status;
	}
}

const defaults: RequestInit = {
	credentials: "include",
	headers: {
		accept: "application/json",
	},
};

/**
 * 检查下响应的状态码是否是 2xx，如果不是则抛出异常。
 */
async function check(response: Response) {
	if (response.ok) {
		return response;
	}
	const message = await response.text();
	throw new BlogAPIError(response, message);
}

/**
 * Promise 的回调函数类型，因为太长所以拿出来，搞不懂 TS 为什么不内置。
 */
type OnFulfilled<T, R> = ((value: T) => R | PromiseLike<R>) | null;
type OnRejected<R> = ((reason: any) => R | PromiseLike<R>) | null;

/**
 * 对 Promise<Response> 的封装，提供默认的检查机制和一些额外的功能。
 *
 * 为了 API 函数调用的简洁，设计上大部分是直接返回响应体，但也有获取头部和原始响应对象的。
 * 对此就需要一个简便的方式来获取响应的各个部分，也就有了这个封装。
 *
 * <h2>用法</h2>
 * @example
 * // 该类实现了 Promise<Response>，可以直接 await
 * try {
 *     const res = await apiService.get(...);
 * } catch(e) {
 *     console.error(e.message);
 * }
 *
 * // 直接 await 会检查响应的状态码，如果不想检查请使用 raw 属性
 * const unchecked = await apiService.get(...).raw;
 *
 * // 只关心响应体则使用 data 属性
 * const data = await apiService.get(...).data;
 *
 * // 使用 location 来获取 Location 头
 * const location = await apiService.get(...).location;
 */
export class ResponseFacade<T> implements Promise<Response> {

	readonly raw: Promise<Response>;

	constructor(raw: Promise<Response>) {
		this.raw = raw;
	}

	get data(): Promise<T> {
		return this.then(r => r.json());
	}

	get location(): Promise<string> {
		return this.then(r => r.headers.get("location")!);
	}

	get [Symbol.toStringTag]() {
		return "ResponseFacade";
	}

	catch<E = never>(onRejected: OnRejected<E>) {
		return this.raw.then(check).catch(onRejected);
	}

	finally(onFinally?: any): Promise<Response> {
		return this.raw.then(check).finally(onFinally);
	}

	// 不能偷懒直接用 ...args 作为参数，否则调用方会报 TS1230 错误。
	then<T = Response, R = never>(
		onFulfilled?: OnFulfilled<Response, T>,
		onRejected?: OnRejected<R>,
	) {
		return this.raw.then(check).then(onFulfilled, onRejected);
	}
}

/**
 * 所有接口的父类，子类表示一个 REST 资源端点（文章、评论、草稿等）。
 *
 * 该类提供了对 fetch 的封装让子类能方便地发送请求，方法的设计模仿了 Axios。
 *
 * <h2>API 规范</h2>
 * 1）除上传二进制对象外均使用 JSON 请求体，响应体均为 JSON 格式。
 * 2）遵循 REST 规范。
 */
export abstract class EndpointBase {

	private readonly init: RequestInit;

	readonly baseURL: string;

	constructor(baseURL: string, init: RequestInit) {
		this.baseURL = baseURL;
		this.init = init;
	}

	/**
	 * 一个最简单的请求封装，处理了请求头、请求体和异常。
	 *
	 * @param method 请求方法，默认为 GET
	 * @param url API 路径
	 * @param data 请求体
	 * @param params URL 中的参数部分
	 */
	protected fetch<R>(method: string, url: string, data?: any, params?: Record<string, any>) {
		const init = { ...this.init, method , headers: { ...this.init.headers } };
		const headers = init.headers as Record<string, string>;

		// body 为 FormData 时会自动设置 Content-Type 为 multipart/form-data。
		if (data instanceof FormData) {
			init.body = data;
		} else if (data) {
			init.body = JSON.stringify(data);
			headers["content-type"] = "application/json";
		}

		if (params) {
			// URLSearchParams 会将 undefined 值序列化为字符串，这里处理下。
			// https://github.com/whatwg/url/issues/427
			for (const k of Object.keys(params)) {
				if (params[k] === undefined)
					delete params[k];
			}
			url = `${url}?${new URLSearchParams(params)}`;
		}

		return new ResponseFacade<R>(fetch(new URL(url, this.baseURL), init));
	}

	// 下面都是便捷函数，用函数名作为请求方法从而省略一个参数。

	protected head(url: string, params?: Record<string, any>) {
		return this.fetch<void>("HEAD", url, null, params);
	}

	protected get<R>(url: string, params?: Record<string, any>) {
		return this.fetch<R>("GET", url, null, params);
	}

	protected delete<R>(url: string, params?: Record<string, any>) {
		return this.fetch<R>("DELETE", url, null, params);
	}

	protected post<R>(url: string, data?: any, params?: Record<string, any>) {
		return this.fetch<R>("POST", url, data, params);
	}

	protected put<R>(url: string, data?: any, params?: Record<string, any>) {
		return this.fetch<R>("PUT", url, data, params);
	}

	protected patch<R>(url: string, data?: any, params?: Record<string, any>) {
		return this.fetch<R>("PATCH", url, data, params);
	}
}

/* ============================================================================== *\
            下面是构建 API 对象相关的，因为代码不多所以跟上面的请求处理放一起了
\* ============================================================================== */

/**
 * 表示 EndpointBase 的子类，因为 EndpointBase 是抽象类所以不能直接用它的类型。
 */
type EndpointClass = new (...args: ConstructorParameters<typeof EndpointBase>) => EndpointBase;

type EndpointMap = Record<string | symbol, EndpointClass>;
type APIDefs = Record<string, EndpointMap>;

type FlatEndpoints<T extends EndpointMap> = { [K in keyof T]: [K, T[K]] }[keyof T];

type FlatDefs<T extends APIDefs> = { [K in keyof T]: FlatEndpoints<T[K]> }[keyof T];

type APIMap<T extends APIDefs> = {
	[P in FlatDefs<T> as P[0]]: InstanceType<P[1]>;
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

type Factories = Record<string | symbol, (init: RequestInit) => EndpointBase>;

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
	for (const url of Object.keys(defs)) {
		for (const name of Object.keys(defs[url])) {
			const clazz = defs[url][name];
			factories[name] = (init: RequestInit) => new clazz(url, init);
		}
	}
	return new Proxy(factories, new APIFactoryHandler(defaults));
}
