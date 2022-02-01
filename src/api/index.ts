import axios, { AxiosRequestConfig } from "axios";
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

axios.defaults.withCredentials = true;

// ServiceWorker里已经对API设置了超时，如果支持则不在此处添加超时。
if (import.meta.env.TIMEOUT) {
	if (import.meta.env.SSR || !("serviceWorker" in navigator)) {
		axios.defaults.timeout = import.meta.env.TIMEOUT as number;
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

// TODO: 这里有点问题，升级构建工具时记得改
const apiOrigin = import.meta.env.API_PUBLIC as any;
export const BASE_URL = import.meta.env.SSR
	? import.meta.env.API_INTERNAL
	: typeof apiOrigin === "string"
		? apiOrigin
		: apiOrigin[location.protocol.substring(0, location.protocol.length - 1)];

const DEFAULT_SERVERS: ServerList = {
	web: createAxios(),
	content: createAxios({ baseURL: BASE_URL }),
};

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

	withConfig(processor: RequestConfigProcessor) {
		return new Api(new ServerListFilter(this.serverList, processor));
	}

	/**
	 * 设置取消信号，使请求能够取消。
	 *
	 * @param signal 取消信号
	 * @return API 集
	 */
	withCancelToken(signal?: AbortSignal) {
		return this.withConfig(config => config.signal = signal);
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
