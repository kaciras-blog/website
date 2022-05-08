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

const apiOrigin = import.meta.env.API_PUBLIC as any;
export const contentService = import.meta.env.SSR
	? import.meta.env.API_INTERNAL
	: typeof apiOrigin === "string"
		? apiOrigin
		: apiOrigin[location.protocol.substring(0, location.protocol.length - 1)];


export default defineAPIs({
	[location.href]: {
		media: MediaEndpoint,
	},
	[contentService]: {
		category: CategoryEndpoint,
		article: ArticleEndpoint,
		cards: CardsEndpoint,
		draft: DraftEndpoint,
		discussion: DiscussionEndpoint,
		user: UserEndpoint,
		friend: FriendEndpoint,
		config: ConfigEndpoint,
		notification: NotificationEndpoint,
	},
});
