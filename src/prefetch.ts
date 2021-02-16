import { Store } from "vuex";
import { Route } from "vue-router/types/router";
import { Api } from "./api";
import Vue, { ComponentOptions } from "vue";

// 只是定义一下类型，实现在 entry-client 和 entry-server
export abstract class PrefetchContext {

	abstract store: Store<any>;
	abstract route: Route;
	abstract abortSignal: AbortSignal;
	abstract api: Api;
	abstract isServer: boolean;

	readonly data: { [name: string]: any } = {};

	dataSetter(name: string) {
		return (value: any) => this.data[name] = value;
	}
}

export interface MaybePrefetchComponent extends ComponentOptions<Vue> {
	asyncData?: (ctx: PrefetchContext) => Promise<void>;
}
