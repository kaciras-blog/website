import { EndpointBase } from "./core";

export default class ConfigEndpoint extends EndpointBase {

	load(namespace: string) {
		return this.get<any>(`/config/${namespace}`).data;
	}

	set(namespace: string, properties: object) {
		return this.patch(`/config/${namespace}`, properties);
	}
}
