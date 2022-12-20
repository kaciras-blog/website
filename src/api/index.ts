import { contentServiceURL, webServiceURL } from "./constants";
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
