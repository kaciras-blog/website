import { APIService } from "./core";

export interface Card {
	name: string;
	link: string;
	picture: string;
	description: string;
}

export default class CardEndpoint extends APIService {

	getCards() {
		return this.get<Card[]>("/cards").data;
	}

	setCards(cards: Card[]) {
		return this.put("/cards", cards);
	}
}
