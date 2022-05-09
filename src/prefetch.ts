import type API from "./api";
import { ComponentOptions } from "vue";
import { Pinia } from "pinia";
import { RouteComponent, RouteLocationNormalizedLoaded } from "vue-router";
import { Awaitable } from "@vueuse/core";
import { createNanoEvents, Emitter } from "nanoevents";

/*
 * 本项目使用预载模式，即先获取数据再渲染路由页面，官方也有介绍：
 * https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-before-navigation
 *
 * 之所以选它，是因为有以下优势：
 * 1）简化代码，仅需一个顶部进度条作为指示器，而后加载要在所有需要数据的组件上做菊花图。
 * 2）没有中间的无效状态，要么当前页，要么是完成的新页面，而后加载则有切换过去但全是菊花图的情况。
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
		super("Should redirect to" + location);
		this.code = code;
		this.location = location;
	}
}

/**
 * 预载函数的参数，包含了预载所需的全部信息，注意跟 Vue 的 SSRContext 区分。
 *
 * <h2>为什么自己实现预载机制</h2>
 * 1）serverPrefetch 钩子不在客户端执行，自己调用吧感觉耦合高了不太好。
 * 2）组建内路由钩子虽然跟组件配合得好，但 SSR 需要保存全局状态。
 */
export class PrefetchContext {

	readonly store: Pinia;
	readonly route: RouteLocationNormalizedLoaded;
	readonly api: typeof API;
	readonly signal: AbortSignal;

	readonly data: Record<string, Promise<unknown>> = {};

	constructor(
		store: Pinia,
		route: RouteLocationNormalizedLoaded,
		api: typeof API,
		controller: AbortController,
	) {
		this.store = store;
		this.route = route;
		this.api = api;
		this.signal = controller.signal;
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

export interface PrefetchComponent extends ComponentOptions {
	asyncData?(ctx: PrefetchContext): Awaitable<void>;
}

export function collectTasks(comps: RouteComponent[], session: PrefetchContext) {
	(comps as PrefetchComponent[])
		.forEach(c => c.asyncData?.(session));

	const prefetched: Record<string, unknown> = {};
	const tasks = [];

	for (const [k, v] of Object.entries(session.data)) {
		tasks.push(v.then(d => prefetched[k] = d));
	}

	return Promise.all(tasks).then(() => prefetched);
}
