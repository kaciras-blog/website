import { FetchClient } from "@kaciras/utilities/browser";

export interface Card {
	name: string;
	link: string;
	picture?: string;
	description: string;
}

export default class CardEndpoint extends FetchClient {

	getAll() {
		return this.get("/cards").json<Card[]>();
	}

	setCards(cards: Card[]) {
		return this.put("/cards", cards);
	}
}
