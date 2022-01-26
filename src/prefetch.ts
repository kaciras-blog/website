import { Store } from "vuex";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { Api } from "./api";
import { ComponentOptions } from "vue";

// 只是定义一下类型，实现在 entry-client 和 entry-server
export abstract class PrefetchContext {

	abstract store: Store<any>;
	abstract route: RouteLocationNormalizedLoaded;
	abstract abortSignal: AbortSignal;
	abstract api: Api;
	abstract isServer: boolean;

	readonly data: { [name: string]: any } = {};

	dataSetter(name: string) {
		return (value: any) => this.data[name] = value;
	}
}

export interface MaybePrefetchComponent extends ComponentOptions {
	loadData?: (ctx: PrefetchContext) => Promise<void>;
}
