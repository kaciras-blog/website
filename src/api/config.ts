import { APIService } from "./core";

export default class ConfigEndpoint extends APIService {

	getAll(namespace: string) {
		return this.get(`/config/${namespace}`).data;
	}

	set(namespace: string, properties: object) {
		return this.patch(`/config/${namespace}`, properties);
	}
}
