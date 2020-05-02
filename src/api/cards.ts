import { AbstractApi } from "./core";

export default class extends AbstractApi {

	getCards() {
		return this.servers.content.get("/recommendation/cards").then(r => r.data);
	}

	setCards(cards: any[]) {
		return this.servers.content.put("/recommendation/cards", cards);
	}
}
