import { EndpointBase } from "./core";

export interface Friend {
	url: string;
	name: string;
	background: string;
	favicon?: string;
	friendPage?: string;
}

export default class FriendEndpoint extends EndpointBase {

	getAll() {
		return this.get<Friend[]>("/friends").json;
	}

	makeFriend(friend: Friend) {
		return this.post<Friend>("/friends", friend).json;
	}

	updateFriend(old: Friend, new_: Friend) {
		const oldHost = new URL(old.url).hostname;
		return this.put<void>(`/friends/${oldHost}`, new_);
	}

	updateSort(friends: Friend[]) {
		const hostList = friends.map(friend => new URL(friend.url).hostname);
		return this.put<void>("/friends", hostList);
	}

	rupture(friend: Friend) {
		const host = new URL(friend.url).hostname;
		return this.delete<void>(`/friends/${host}`);
	}
}
