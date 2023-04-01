import { FetchClient } from "@kaciras/utilities/browser";

export enum FriendAccidentType {
	Moved,
	Lost,
	AbandonedMe,
}

export interface FriendAccident {
	type: FriendAccidentType;
	name: string;
	url: string;
	newUrl?: string;
}

export interface DiscussionActivity {
	url: string;
	title: string;
	preview: string;
	floor: number;
	treeFloor: number;
}

export interface Notice<T> {
	id: "Friend" | "Discussion";
	data: T;
	time: number;
}

export default class NotificationEndpoint extends FetchClient {

	getAll() {
		return this.get("/notifications").json<Array<Notice<unknown>>>();
	}

	clear() {
		return this.delete("/notifications");
	}
}
