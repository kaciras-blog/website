import { defineAPIs } from "./core";
import CardsEndpoint from "./cards";
import MediaEndpoint from "./media";

const apiOrigin = import.meta.env.API_PUBLIC as any;
export const BASE_URL = import.meta.env.SSR
	? import.meta.env.API_INTERNAL
	: typeof apiOrigin === "string"
		? apiOrigin
		: apiOrigin[location.protocol.substring(0, location.protocol.length - 1)];


export default defineAPIs({
	[BASE_URL]: {
		cards: CardsEndpoint,
	},
	[location.href]: {
		media: MediaEndpoint,
	},
});
