import { AxiosInstance, AxiosRequestConfig } from "axios";

export interface ServerList {
	web: AxiosInstance;
	content: AxiosInstance;
}

type RequestConfigProcessor = (config: AxiosRequestConfig) => void;

/**
 * 使用ES6代理Axios，以便在请求前修改设置。
 *
 * Axios创建实例不能再使用create来扩展，并且用了个wrap函数封装使得扩展难以进行，
 * 所以才用这种方式，等1.0版本出了再看看能不能用更优雅的方法。
 */
class AxiosProxy implements ProxyHandler<AxiosInstance> {

	private readonly processor: RequestConfigProcessor;

	constructor(processor: RequestConfigProcessor) {
		this.processor = processor;
	}

	private prepare(config: AxiosRequestConfig) {
		config = config || {};
		this.processor(config);
		return config;
	}

	get(target: AxiosInstance, name: keyof AxiosInstance) {
		switch (name) {
			case "request":
				return (config: AxiosRequestConfig) => target[name](this.prepare(config));
			case "get":
			case "delete":
			case "head":
				return (url: string, config: AxiosRequestConfig) =>
					target[name](url, this.prepare(config));
			case "post":
			case "put":
			case "patch":
				return (url: string, data: any, config: AxiosRequestConfig) =>
					target[name](url, data, this.prepare(config));
			default:
				return target[name];
		}
	}
}

export class ServerListFilter implements ServerList {

	private readonly inner: ServerList;
	private readonly processor: RequestConfigProcessor;

	constructor(inner: ServerList, processor: RequestConfigProcessor) {
		this.inner = inner;
		this.processor = processor;
	}

	get web() {
		return new Proxy(this.inner.web, new AxiosProxy(this.processor));
	}

	get content() {
		return new Proxy(this.inner.content, new AxiosProxy(this.processor));
	}
}

// @formatter:off
export class AbstractApi {
	constructor(readonly servers: ServerList) {}
}
// @formatter:on
