import { AbstractResource } from "./core";

export interface Card {
	name: string;
	link: string;
	picture: string;
	description: string;
}

export default class CardResource extends AbstractResource {

	getCards() {
		return this.servers.content.get<Card[]>("/cards").then(r => r.data);
	}

	setCards(cards: Card[]) {
		return this.servers.content.put("/cards", cards);
	}
}
