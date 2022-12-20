import { EndpointBase } from "./core";

export interface Card {
	name: string;
	link: string;
	picture?: string;
	description: string;
}

export default class CardEndpoint extends EndpointBase {

	getAll() {
		return this.get<Card[]>("/cards").json;
	}

	setCards(cards: Card[]) {
		return this.put("/cards", cards);
	}
}
