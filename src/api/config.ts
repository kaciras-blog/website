import { FetchClient } from "@kaciras/utilities/browser";

export default class ConfigEndpoint extends FetchClient {

	load(namespace: string) {
		return this.get(`/config/${namespace}`).json();
	}

	set(namespace: string, properties: object) {
		return this.patch(`/config/${namespace}`, properties);
	}
}
