import { defineAPIs } from "./core";
import ArticleEndpoint from "./article";
import CardsEndpoint from "./cards";
import FriendEndpoint from "./friend";
import DraftEndpoint from "./draft";
import UserEndpoint from "./user";
import MediaEndpoint from "./media";
import ConfigEndpoint from "./config";
import NotificationEndpoint from "./notification";
import CategoryEndpoint from "./category";
import DiscussionEndpoint from "./discussion";

export * from "./common";
export * from "./article";
export * from "./cards";
export * from "./friend";
export * from "./draft";
export * from "./user";
export * from "./media";
export * from "./config";
export * from "./notification";
export * from "./category";
export * from "./discussion";

type PublicAPIConfig = string | number | Record<string, string | number>;

/**
 * 获取内容服务器的 URL 前缀，适配各种场景。
 *
 * 因为内容服务器是用 JAVA 写的，我又懒得加层代理去统一域名端口，
 * 所以在各个情况下其地址不同，复杂到需要一个函数来判断。
 *
 * @param config 配置项 config.backend.public
 */
function getContentServerURL(config: PublicAPIConfig): string {
	if (import.meta.env.SSR) {
		return import.meta.env.API_INTERNAL;
	}
	const { protocol, hostname } = location;
	switch (typeof config) {
		case "object":
			return getContentServerURL(config[protocol.slice(0, -1)]);
		case "string":
			return config;
		default:
			return `${protocol}//${hostname}:${config}`;
	}
}

export const contentServiceURL = getContentServerURL(import.meta.env.API_PUBLIC);

const webServiceURL = import.meta.env.SSR ? "__NEVER_USED__" : location.href;

export default defineAPIs({
	[webServiceURL]: {
		media: MediaEndpoint,
	},
	[contentServiceURL]: {
		category: CategoryEndpoint,
		article: ArticleEndpoint,
		cards: CardsEndpoint,
		draft: DraftEndpoint,
		discuss: DiscussionEndpoint,
		user: UserEndpoint,
		friend: FriendEndpoint,
		config: ConfigEndpoint,
		notification: NotificationEndpoint,
	},
});
