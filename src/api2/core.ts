/**
 *
 */
export class BlogAPIError extends Error {

	readonly response: Response;
	readonly code: number;

	constructor(response: Response, message: string) {
		super(message);
		this.response = response;
		this.code = response.status;
	}
}

async function check(response: Response) {
	if (response.ok) {
		return response;
	}
	const message = await response.text();
	throw new BlogAPIError(response, message);
}

export class ResponseFacade<T> implements Promise<Response> {

	public readonly raw: Promise<Response>;

	constructor(raw: Promise<Response>) {
		this.raw = raw;
	}

	get data(): Promise<T> {
		return this.raw.then(check).then(r => r.json());
	}

	get location(): Promise<string> {
		return this.raw
			.then(check)
			.then(r => r.headers.get("location")!);
	}

	get [Symbol.toStringTag]() {
		return "ResponseFacade";
	}

	catch<E = never>(onRejected: any): Promise<Response | E> {
		return this.raw.then(check).catch(onRejected);
	}

	finally(onFinally?: any): Promise<Response> {
		return this.raw.then(check).finally(onFinally);
	}

	then<R = Response, E = never>(...args: any[]): Promise<R | E> {
		return this.raw.then(check).then(...args);
	}
}

/**
 * 对 fetch 的封装，API 的设计模仿了 Axios。
 *
 * <h2>API 规范</h2>
 * 1）除上传二进制对象外均使用 JSON 请求体，响应体均为 JSON 格式。
 * 2）遵循 REST 规范。
 */
export class APIService {

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
		const init = { ...this.init };
		const headers = init.headers as Record<string, string>;

		if (data instanceof FormData) {
			init.body = data;
			headers["content-type"] = "multipart/form-data";
		} else if (data) {
			init.body = JSON.stringify(data);
			headers["content-type"] = "application/json";
		}

		if (params) {
			url = `${url}?${new URLSearchParams(params)}`;
		}

		return new ResponseFacade<R>(fetch(new URL(url, this.baseURL), init));
	}

	// 下面都是快捷方法，用函数名作为请求方法从而省略一个参数。

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

const defaults: RequestInit = {
	credentials: "include",
	headers: {
		accept: "application/json",
	},
};

type Factories = Record<string | symbol, (init: RequestInit) => APIService>;

class BlogAPISet implements ProxyHandler<Factories> {

	private readonly base: RequestInit;

	constructor(base: RequestInit) {
		this.base = base;
	}

	configure(target: Factories, init: RequestInit) {
		init = { ...this.base, ...init };
		return new Proxy(target, new BlogAPISet(init));
	}

	get(target: Factories, property: string | symbol) {
		if (property === "configure") {
			return (init: RequestInit) => this.configure(target, init);
		}
		return target[property](this.base);
	}
}

type EndpointMap = Record<string | symbol, typeof APIService>;
type APIDefs = Record<string, EndpointMap>;

type S<T extends EndpointMap> = { [K in keyof T]: [K, T[K]] }[keyof T];

type FlatToArray<T extends APIDefs> = { [K in keyof T]: S<T[K]> }[keyof T];

type APIMap<T extends APIDefs> = {
	[P in FlatToArray<T> as P[0]]: InstanceType<P[1]>;
} & {
	configure(init: RequestInit): APIMap<T>;
};

export function defineAPIs<T extends APIDefs>(defs: T) {
	const factories: any = {};
	for (const url of Object.keys(defs)) {
		for (const name of Object.keys(defs[url])) {
			const clazz = defs[url][name];
			factories[name] = (init: RequestInit) => new clazz(url, init);
		}
	}
	return new Proxy(factories, new BlogAPISet(defaults)) as APIMap<T>;
}
