import { FetchClient } from "@kaciras/utilities/browser";

export interface Friend {
	url: string;
	name: string;
	background: string;
	favicon?: string;
	friendPage?: string;
}

export default class FriendEndpoint extends FetchClient {

	getAll() {
		return this.get("/friends").json<Friend[]>();
	}

	makeFriend(friend: Friend) {
		return this.post("/friends", friend).json<Friend>();
	}

	updateFriend(old: Friend, new_: Friend) {
		const oldHost = new URL(old.url).hostname;
		return this.put(`/friends/${oldHost}`, new_);
	}

	updateSort(friends: Friend[]) {
		const hostList = friends.map(friend => new URL(friend.url).hostname);
		return this.put("/friends", hostList);
	}

	rupture(friend: Friend) {
		const host = new URL(friend.url).hostname;
		return this.delete(`/friends/${host}`);
	}
}
