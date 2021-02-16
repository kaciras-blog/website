import axios, { AxiosRequestConfig, CancelToken } from "axios";
import { RequestConfigProcessor, ServerList, ServerListFilter } from "./core";

// 为了让IDE能够分析类型只能一个个导入再导出，这么写好啰嗦啊
import ArticleApi from "./article";
import DraftApi from "./draft";
import CategoryApi from "./category";
import DiscussApi from "./discussion";
import UserApi from "./user";
import FriendApi from "./firend";
import MiscApi from "./misc";
import ConfigApi from "./config";
import RecommendApi from "./cards";
import NotificationApi from "./notification";

export * from "./article";
export * from "./draft";
export * from "./category";
export * from "./discussion";
export * from "./user";
export * from "./firend";
export * from "./misc";
export * from "./config";
export * from "./cards";
export * from "./notification";

const CSRF_COOKIE_NAME = "CSRF-Token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

/*
 * 【设计错误】
 * 后端将用户信息记录在SESSION里，而SESSION对应的Cookie跟登录控制器不在一个层级，
 * 导致无法将 SESSION Cookie 的过期时间设置为会话结束，如果登录时未选择记住登陆则会造成后端无法判断，
 * 于是是否登录的判断全靠CSRF。
 */
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = CSRF_COOKIE_NAME;
axios.defaults.xsrfHeaderName = CSRF_HEADER_NAME;

// ServiceWorker里已经对API设置了超时，如果支持则不在此处添加超时。
if (process.env.TIMEOUT) {
	if (process.env.VUE_ENV === "server" || !("serviceWorker" in navigator)) {
		axios.defaults.timeout = process.env.TIMEOUT as unknown as number;
	}
}

// axios 不能全局配置拦截？
function createAxios(config?: AxiosRequestConfig) {
	const instance = axios.create(config);

	instance.interceptors.response.use(undefined, error => {
		if (error.response) {
			error.code = error.response.status;
		} else {
			error.code = -1; // 连接失败
		}
		return Promise.reject(error);
	});
	return instance;
}

const apiOrigin = process.env.API_ORIGIN as any;
export const BASE_URL = typeof apiOrigin === "string"
	? apiOrigin
	: apiOrigin[location.protocol.substring(0, location.protocol.length - 1)];

const DEFAULT_SERVERS: ServerList = {
	web: createAxios(),
	content: createAxios({ baseURL: BASE_URL }),
}

export class Api {

	private readonly serverList: ServerList;

	constructor(serverList: ServerList) {
		this.serverList = serverList;
	}

	static register(name: string, clazz: any) {
		Object.defineProperty(Api.prototype, name, {
			get() {
				return new clazz(this.serverList);
			},
			enumerable: true,
			configurable: true,
		});
	}

	withConfigProcessor(processor: RequestConfigProcessor) {
		return new Api(new ServerListFilter(this.serverList, processor));
	}

	/**
	 * 设置取消令牌，使请求能够取消，支持原生 AbortSignal 和 Axios 的 CancelToken
	 *
	 * @param token 取消令牌
	 * @return API集
	 */
	withCancelToken(token: CancelToken | AbortSignal) {
		if (token instanceof AbortSignal) {
			const source = axios.CancelToken.source();
			token.onabort = () => source.cancel();
			token = source.token;
		}
		return this.withConfigProcessor(config => config.cancelToken = token as CancelToken);
	}
}

Api.register("article", ArticleApi);
Api.register("draft", DraftApi);
Api.register("category", CategoryApi);
Api.register("discuss", DiscussApi);
Api.register("friend", FriendApi);
Api.register("user", UserApi);
Api.register("config", ConfigApi);
Api.register("recommend", RecommendApi);
Api.register("misc", MiscApi);
Api.register("notification", NotificationApi);

// 也是为了让IDE能够提示
export interface Api {
	article: ArticleApi;
	draft: DraftApi;
	category: CategoryApi;
	discuss: DiscussApi;
	friend: FriendApi;
	user: UserApi;
	config: ConfigApi;
	recommend: RecommendApi;
	misc: MiscApi;
	notification: NotificationApi;
}

export default new Api(DEFAULT_SERVERS);
