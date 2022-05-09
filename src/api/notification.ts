import { EndpointBase } from "./core";


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

export default class NotificationEndpoint extends EndpointBase {

	getAll() {
		return this.get<Array<Notice<unknown>>>("/notifications").data;
	}

	clear() {
		return this.delete("/notifications");
	}
}
