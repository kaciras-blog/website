/*
 * 导航前加载数据，在官方教程的基础上修改而来，增加了以下功能：
 * 1.在异步组件解析前就显示加载指示器，让过渡更顺畅。
 * 2.处理一些异常情况，例如跳转。在出现内部错误时显示错误页面。
 * 3.允许取消正在进行的预加载，并中止网络请求。
 */
import { RouteComponent, RouteLocationNormalizedLoaded, Router } from "vue-router";
import { Pinia } from "pinia";
import api from "@/api/index.ts";
import { usePrefetch } from "@/store/index.ts";
import { isOnlyHashChange } from "@/utils.ts";
import { collectTasks, events, PrefetchContext } from "./prefetch.ts";

let controller = new AbortController();

/**
 * 预载下一个路由的组件数据，并处理加载指示器、错误页面、新页面标题等任务。
 *
 * @param store Pinia 存储实例
 * @param to 即将要进入的目标路由对象
 * @param components 需要预载数据的组件数组
 */
export async function prefetch(
	store: Pinia,
	to: RouteLocationNormalizedLoaded,
	components: RouteComponent[],
) {
	if (components.length === 0) {
		return;
	}
	const scopedAPI = api.configure({ signal: controller.signal });
	const ctx = new PrefetchContext(store, to, scopedAPI, controller);

	const prefetching = collectTasks(components, ctx);
	events.emit("prefetch", ctx);

	try {
		const data = await prefetching;
		events.emit("end");

		if (controller.signal.aborted) {
			console.debug(`导航被取消：${to.path}`);
			return false;
		} else {
			usePrefetch(store).data = data;
		}
	} catch (err) {
		if (controller.signal.aborted) {
			console.debug(`导航被取消：${to.path}`);
			return false;
		}

		controller.abort();
		events.emit("error", err);

		switch (err.code) {
			case -1:
				break;
			case 301:
			case 302:
				events.emit("end");
				return err.location;
			case 404:
			case 410:
				return { path: "/error/" + err.code, replace: true };
			default:
				console.error(err);
				return "/error/500";
		}
	}
}

export function installRouterHooks(store: Pinia, router: Router) {

	/**
	 * 相比于官网示例，这里把加载指示器提前到 beforeEach 钩子，以便在异步组件下载前就开始加载提示。
	 *
	 * 另外，文章页面有 Markdown 生成的标题跳转链接，这些链接都是页内跳转不需要走预加载流程，所以
	 * 这里检查下是否仅 HASH 变化，如果是则跳过预载流程。
	 *
	 * 在 isOnlyHashChange 为 true 时，应当直接返回而不是 return next(false)，否则浏览器URL不会改变。
	 */
	router.beforeEach((to, from) => {
		if (isOnlyHashChange(to, from)) {
			return;
		}
		controller = new AbortController();
		events.emit("start", controller.signal);
	});

	// 使用 router.beforeResolve()，以便确保所有异步组件都 resolve。
	router.beforeResolve((to, from) => {
		if (controller.signal.aborted) {
			console.debug(`导航被取消：${to.path}`);
			return false;
		}

		// （这段是官网给的）我们只关心非预渲染的组件，所以我们对比它们，找出两个匹配列表的差异组件。
		const matched = to.matched.flatMap(v => v.components);
		const previous = from.matched.flatMap(v => v.components);
		let diffed = false;

		const activated = matched
			.map(module => (module as any).default)
			.filter((c, i) => diffed || (diffed = (previous[i] !== c)));

		return prefetch(store, to, activated);
	});
}
