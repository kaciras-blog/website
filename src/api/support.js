// 这个文件里用了太多动态调用，懒得写成TS了
import Axios from "axios";
import cookies from "axios/lib/helpers/cookies";
import isURLSameOrigin from "axios/lib/helpers/isURLSameOrigin";
import { isStandardBrowserEnv } from "axios/lib/utils";
import * as KxUI from "kx-ui/src/cancellation";

const CSRF_COOKIE_NAME = "CSRF-Token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

Axios.defaults.withCredentials = true;

// CSRF Token 在下面自定义处理了
// Axios.defaults.xsrfCookieName = CSRF_COOKIE_NAME;
// Axios.defaults.xsrfHeaderName = CSRF_HEADER_NAME;

if (process.env.NODE_ENV === "production") {
	Axios.defaults.timeout = 10000;
}

/**
 * 配置Axios实例，在请求参数中带上Token来防止CSRF攻击。
 *
 * Axios内置了在请求头中带Token的功能，但是这个请求头将导致所有跨域请求都要预检。
 * 这里自定义了这一过程，并排除掉安全请求（GET，HEAD）以提高性能。
 *
 * @param axios Axios实例
 */
function parameterCsrfProtection(axios) {

	function configure(config) {
		const method = config.method.toUpperCase();
		if (method === "GET" || method === "HEAD") {
			return config;
		}
		const xsrfValue = config.withCredentials || isURLSameOrigin(config.url)
			? cookies.read(CSRF_COOKIE_NAME) : null;

		if (xsrfValue) {
			// config.params = config.params || {};
			// config.params["csrf"] = xsrfValue;
			config.headers[CSRF_HEADER_NAME] = xsrfValue;
		}
		return config;
	}

	if (isStandardBrowserEnv()) {
		axios.interceptors.request.use(configure);
	}
}

// MDZZ，axios不能全局配置拦截？
function createAxios(config) {
	const axios = Axios.create(config);
	parameterCsrfProtection(axios);

	axios.interceptors.response.use(null, error => {
		if (error.response) {
			error.code = error.response.status;
		} else {
			error.code = -1; // 连接失败
		}
		return Promise.reject(error);
	});
	return axios;
}


export class BasicApiFactory {

	constructor(axiosSet = {
		mainServer: createAxios({ baseURL: process.env.CONFIG.contentServerUri }),
		webServer: createAxios(),
	}) {
		this.axiosSet = axiosSet;
	}

	/**
	 * 设置原请求，发送的请求将使用原请求的 Cookie 和一些 Header 以表现出与原请求相同的身份。
	 * 该方法仅用于服务端渲染，在浏览器中无效。
	 *
	 * @param proto 原请求
	 * @return {*} API集
	 */
	withPrototype(proto) {
		return new ProxyApiFactory(this.axiosSet).withPrototype(proto);
	}

	/**
	 * 设置取消令牌，使请求能够取消。
	 *
	 * @param cancelToken { CancelToken } 取消令牌
	 * @return {*} API集
	 */
	withCancelToken(cancelToken) {
		return new ProxyApiFactory(this.axiosSet).withCancelToken(cancelToken);
	}

	// protected
	createApiInstance(clazz) {
		return new clazz(this.axiosSet);
	}

	static registerApi(name, clazz) {
		Object.defineProperty(BasicApiFactory.prototype, name, {
			configurable: true,
			get() { return this.createApiInstance(clazz); },
		});
	}
}


class AxiosSetProxy {

	constructor(filters) {
		this.filters = filters;
	}

	get(target, name) {
		return new Proxy(target[name], new AxiosProxy(this.filters));
	}
}

/**
 * 使用ES6代理Axios，以便在请求前修改设置。
 *
 * Axios创建实例不能再使用create来扩展，并且用了个wrap函数封装使
 * 得扩展难以进行，所以才用这种方式，等1.0版本出了再看看能不能用更优雅的方法。
 */
class AxiosProxy {

	constructor(filters) {
		this.filters = filters;
	}

	prepare(config) {
		config = config || {};
		this.filters.forEach(f => f(config));
		return config;
	}

	get(target, name) {
		if (["delete", "get", "head", "options"].indexOf(name) > 0) {
			return (url, config) => target[name](url, this.prepare(config));
		}
		if (["post", "put", "patch"].indexOf(name) > 0) {
			return (url, data, config) => target[name](url, data, this.prepare(config));
		}
		return config => target[name](this.prepare(config));
	}
}

class ProxyApiFactory extends BasicApiFactory {

	constructor(axiosSet) {
		super(axiosSet);
		this.filters = [];
	}

	createApiInstance(clazz) {
		return new clazz(new Proxy(this.axiosSet, new AxiosSetProxy(this.filters)));
	}

	// TODO: 所有请求都穿透了CSRF，但安全请求并不需要
	withPrototype(proto) {
		if (!proto) {
			return this;
		}
		this.filters.push(config => {
			config.headers = config.headers || {};

			// UA可以随便改，没啥实际用，还不如穿透了统计下客户端类型
			if (proto.headers["user-agent"]) {
				config.headers["User-Agent"] = proto.headers["user-agent"];
			}
			if (proto.headers.cookie) {
				config.headers.Cookie = proto.headers.cookie;
			}

			const csrfToken = proto.cookies.get(CSRF_COOKIE_NAME);
			if (csrfToken) {
				config.headers[CSRF_HEADER_NAME] = csrfToken;
			}

			// SSR 也属于反向代理，记得带上原始IP
			config.headers["X-Forwarded-For"] = proto.ip;
		});
		return this;
	}

	withCancelToken(cancelToken) {
		if (!cancelToken) {
			return this;
		}
		if (cancelToken instanceof KxUI.CancelToken) {
			const axiosCancelToken = Axios.CancelToken.source();
			cancelToken.onCancel(axiosCancelToken.cancel);
			cancelToken = axiosCancelToken.token;
		}
		this.filters.push(config => config.cancelToken = cancelToken);
		return this;
	}
}
