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
}

export interface DiscussionActivity {
	url: string;
	title: string;
	preview: string;
	floor: number;
	treeFloor: number;
}

export interface Notice<T> {
	id: "Friend" | "Discussion",
	data: T;
	time: number;
}

export default class extends AbstractResource {

	getAll() {
		return this.servers.content.get<Notice<unknown>[]>("/notifications").then(r => r.data);
	}

	clear() {
		return this.servers.content.delete<void>("/notifications");
	}
}
