import { AbstractApi } from "./core";

interface FriendLink {
	name: string;
	url: string;
	favicon: string;
}

export default class extends AbstractApi {

	getFriends() {
		return this.servers.content.get("/friends").then(r => r.data);
	}

	makeFriends(link: FriendLink) {
		return this.servers.content.post("/friends", link).then(r => r.data);
	}

	rupture(link: FriendLink) {
		const host = new URL(link.url).hostname;
		return this.servers.content.delete("/friends/" + host);
	}
}
