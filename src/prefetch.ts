import { ComponentOptions, onBeforeMount, useSSRContext } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import { createNanoEvents, Emitter } from "nanoevents";
import { Api } from "./api";

/*
 * 本项目使用预载模式，即先获取数据再渲染路由页面，官方也有对此的介绍：
 * https://next.router.vuejs.org/guide/advanced/data-fetching.html#fetching-before-navigation
 *
 *
 */

export interface PrefetchEventMap {

	start(signal: AbortSignal): void;

	prefetch(context: PrefetchContext): void;

	end(): void;

	error(cause: Error): void;
}

/**
 * 在预载的各个阶段都会发出一些事件，可以获取相关信息，用于进度条等等地方。
 * 该对象仅客户端有效，SSR 不发出任何事件，请注意避免在 SSR 中监听。
 */
export const events = import.meta.env.SSR
	? {} as Emitter<PrefetchEventMap>
	: createNanoEvents<PrefetchEventMap>();

class RedirectException extends Error {

	readonly code: number;
	readonly location: string;

	constructor(code: number, location: string) {
		super();
		this.code = code;
		this.location = location;
	}
}

export abstract class PrefetchContext {

	abstract store: Store<any>;
	abstract route: RouteLocationNormalizedLoaded;
	abstract signal: AbortSignal;
	abstract api: Api;
	abstract isServer: boolean;

	readonly data: { [name: string]: any } = {};

	dataSetter(name: string) {
		return (value: any) => this.data[name] = value;
	}

	/**
	 * 在预载时发现需要重定向，本次的渲染结果将被丢弃。
	 *
	 * @param code 状态码，通常是 301 或 302
	 * @param location 新的地址
	 */
	redirect(code: number, location: string): never {
		throw new RedirectException(code, location);
	}
}

export interface MaybePrefetchComponent extends ComponentOptions {
	asyncData?: (ctx: PrefetchContext) => Promise<void>;
}

/**
 * 用来注入些 SEO 相关的信息。
 */
interface HeadMetaObject {
	meta?: string;
	title?: string;
}

function useSSRHeadMeta() {
	return useSSRContext<HeadMetaObject>()!;
}

// meta 对于客户端无意义，就不管它了。
function useClientHeadMeta() {
	const object: HeadMetaObject = {};
	onBeforeMount(() => {
		const { title } = object;
		if (title) {
			document.title = title + " - Kaciras 的博客";
		}
	});
	return object;
}

export const useHeadMeta = import.meta.env.SSR
	? useSSRHeadMeta : useClientHeadMeta;
