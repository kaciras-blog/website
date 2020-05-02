import { AbstractResource } from "./core";

interface Friend {
	name: string;
	url: string;
	favicon: string;
}

export default class FriendResource extends AbstractResource {

	getFriends() {
		return this.servers.content.get<Friend[]>("/friends").then(r => r.data);
	}

	makeFriends(link: Friend) {
		return this.servers.content.post<Friend>("/friends", link).then(r => r.data);
	}

	rupture(link: Friend) {
		const host = new URL(link.url).hostname;
		return this.servers.content.delete(`/friends/${host}`);
	}
}
