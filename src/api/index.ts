import { contentServiceURL, webServiceURL } from "./constants";
import { defineAPIs } from "./core";
import ArticleEndpoint from "./article";
import CardsEndpoint from "./cards";
import FriendEndpoint from "./friend";
import DraftEndpoint from "./draft";
import DiagnosticsEndpoint from "./diagnostics";
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

/*
 * 顶层的键使用了变量，都是 string，TypeScript 会做处理以便表示可能出现的键相等的情况。
 * 处理后的类型破坏了 APIMap 的推导，导致 api 的类型出错。
 *
 * 实际上 webServiceURL 和 contentServiceURL 不会相等，但这是静态推导无法判断的。
 * 故此处给顶层的键强制转换成不相等的常量，手动避免这种情况。
 */

export default defineAPIs({
	[webServiceURL as "1"]: {
		diagnostics: DiagnosticsEndpoint,
		media: MediaEndpoint,
	},
	[contentServiceURL as "2"]: {
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
