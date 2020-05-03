import axios, { AxiosRequestConfig, CancelToken } from "axios";
import { CancellationToken } from "@kaciras-blog/uikit";
import { RequestConfigProcessor, ServerList, ServerListFilter } from "./core";

// 为了让IDE能够分析类型只能一个个导入再导出
import ArticleApi from "./article";
import DraftApi from "./draft";
import CategoryApi from "./category";
import DiscussApi from "./discussion";
import UserApi from "./user";
import FriendApi from "./firend";
import MiscApi from "./misc";
import ConfigApi from "./config";
import RecommendApi from "./cards";

export * from "./article";
export * from "./draft";
export * from "./category";
export * from "./discussion";
export * from "./user";
export * from "./firend";
export * from "./misc";
export * from "./config";
export * from "./cards";

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

if (process.env.NODE_ENV === "production") {
	axios.defaults.timeout = 10000;
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

const apiOrigin = (process.env.CONFIG as any).CONTENT_SERVER_URI;
const BASE_URL = typeof apiOrigin === "string"
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
	 * 设置取消令牌，使请求能够取消。
	 *
	 * @param token 取消令牌
	 * @return API集
	 */
	withCancelToken(token?: CancelToken | CancellationToken) {
		if(!token) {
			return this;
		}
		if ("addListener" in token) {
			const axiosTokenSource = axios.CancelToken.source();
			token.addListener(axiosTokenSource.cancel);
			token = axiosTokenSource.token;
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
}

export default new Api(DEFAULT_SERVERS);
