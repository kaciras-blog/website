import { AbstractResource } from "./core";

export interface Friend {
	url: string;
	name: string;
	background: string;
	favicon: string;
	friendPage: string;
}

export default class FriendResource extends AbstractResource {

	getFriends() {
		return this.servers.content.get<Friend[]>("/friends").then(r => r.data);
	}

	makeFriend(friend: Friend) {
		return this.servers.content.post<Friend>("/friends", friend).then(r => r.data);
	}

	updateAll(friends: Friend[]) {
		return this.servers.content.put<void>("/friends", friends);
	}

	rupture(friend: Friend) {
		const host = new URL(friend.url).hostname;
		return this.servers.content.delete(`/friends/${host}`);
	}
}
