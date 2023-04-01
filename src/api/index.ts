import { defineAPIs } from "./core.ts";
import { contentServiceURL, webServiceURL } from "./constants.ts";
import ArticleEndpoint from "./article.ts";
import CardsEndpoint from "./cards.ts";
import FriendEndpoint from "./friend.ts";
import DraftEndpoint from "./draft.ts";
import DiagnosticsEndpoint from "./diagnostics.ts";
import UserEndpoint from "./user.ts";
import MediaEndpoint from "./media.ts";
import ConfigEndpoint from "./config.ts";
import NotificationEndpoint from "./notification.ts";
import CategoryEndpoint from "./category.ts";
import DiscussionEndpoint from "./discussion.ts";

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
