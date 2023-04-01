import { FetchClient } from "@kaciras/utilities/browser";

export default class DiagnosticsEndpoint extends FetchClient {

	runGC() {
		return this.post("/diagnostics/gc");
	}
}
