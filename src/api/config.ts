import { AbstractApi } from "./core";

export default class extends AbstractApi {

	get(namespace: string) {
		return this.servers.content.get(`/config/${namespace}`).then(r => r.data);
	}

	set(namespace: string, properties: object) {
		return this.servers.content.patch(`/config/${namespace}`, properties);
	}
}
