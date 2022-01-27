import { ComponentOptions } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import { createNanoEvents, Emitter } from "nanoevents";
import { Api } from "./api";

export interface PrefetchEventMap {

	start(signal: AbortSignal): void;

	prefetch(context: PrefetchContext): void;

	end(): void;

	error(cause: Error): void;
}

export const events = import.meta.env.SSR
	? {} as Emitter<PrefetchEventMap>
	: createNanoEvents<PrefetchEventMap>();

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
