import { Store } from "vuex";
import { Route } from "vue-router/types/router";
import { CancellationToken } from "@kaciras-blog/uikit";
import { Api } from "./api";

// 只是定义一下类型，实现在 entry-client 和 entry-server
export abstract class PrefetchContext {

	abstract readonly store: Store<any>;

	abstract readonly route: Route;

	abstract readonly api: Api;

	abstract readonly cancelToken: CancellationToken;

	abstract readonly isServer: boolean;

	readonly data: { [name: string]: any } = {};

	dataSetter(name: string) {
		return (value: any) => this.data[name] = value;
	}
}
