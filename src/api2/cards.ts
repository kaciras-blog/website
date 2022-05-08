import { APIService } from "@/api2/core";

export interface Card {
	name: string;
	link: string;
	picture: string;
	description: string;
}

export default class CardEndpoint extends APIService {

	getCards() {
		return this.content.get<Card[]>("/cards");
	}

	setCards(cards: Card[]) {
		return this.content.put("/cards", cards);
	}
}
