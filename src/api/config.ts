import { AbstractResource } from "./core";

export default class ConfigResource extends AbstractResource {

	get(namespace: string) {
		return this.servers.content.get(`/config/${namespace}`).then(r => r.data);
	}

	set(namespace: string, properties: object) {
		return this.servers.content.patch(`/config/${namespace}`, properties);
	}
}
