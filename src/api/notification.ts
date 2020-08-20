import { AbstractResource } from "./core";

export enum FriendAccidentType {
	Moved = "Moved",
	AbandonedMe = "AbandonedMe",
	Inaccessible = "Inaccessible",
}

export interface FriendAccident {
	type: FriendAccidentType;
	name: string;
	url: string;
	newUrl?: string;
	time: number
}

export interface DiscussionActivity {
	url: string;
	title: string;
	preview: string;
	floor: number;
	parentFloor: number;
	time: number;
}

export interface NotificationMap {
	friends: FriendAccident[];
	discussions: DiscussionActivity[];
}

export default class extends AbstractResource {

	getAll() {
		return this.servers.content.get<NotificationMap>("/notifications").then(r => r.data);
	}

	clear() {
		return this.servers.content.delete<void>("/notifications");
	}
}
