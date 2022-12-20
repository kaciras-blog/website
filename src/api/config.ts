import { EndpointBase } from "./core";

export default class ConfigEndpoint extends EndpointBase {

	load(namespace: string) {
		return this.get<any>(`/config/${namespace}`).json;
	}

	set(namespace: string, properties: object) {
		return this.patch(`/config/${namespace}`, properties);
	}
}
