import { APIService } from "./core";

export default class ConfigEndpoint extends APIService {

	load(namespace: string) {
		return this.get<any>(`/config/${namespace}`).data;
	}

	set(namespace: string, properties: object) {
		return this.patch(`/config/${namespace}`, properties);
	}
}
