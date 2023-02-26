import { EndpointBase } from "@/api/core";

export default class DiagnosticsEndpoint extends EndpointBase {

	runGC() {
		return this.post("/diagnostics/gc");
	}
}
