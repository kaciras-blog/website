import { AbstractResource } from "./core";

export interface Friend {
	url: string;
	name: string;
	background: string;
	favicon: string;
	friendPage?: string;
}

export default class FriendResource extends AbstractResource {

	getFriends() {
		return this.servers.content.get<Friend[]>("/friends").then(r => r.data);
	}

	makeFriend(friend: Friend) {
		return this.servers.content.post<Friend>("/friends", friend).then(r => r.data);
	}

	updateFriend(old: Friend, new_: Friend) {
		const oldHost = new URL(old.url).hostname;
		return this.servers.content.put<void>(`/friends/${oldHost}`, new_);
	}

	updateSort(friends: Friend[]) {
		const hostList = friends.map(friend => new URL(friend.url).hostname);
		return this.servers.content.put<void>("/friends", hostList);
	}

	rupture(friend: Friend) {
		const host = new URL(friend.url).hostname;
		return this.servers.content.delete<void>(`/friends/${host}`);
	}
}
