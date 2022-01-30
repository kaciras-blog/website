import { basename } from "path";
import { Store } from "vuex";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { renderToString, SSRContext } from 'vue/server-renderer';
import { SET_WIDTH } from "@kaciras-blog/uikit";
import { configureForProxy } from "@kaciras-blog/server/lib/axios-helper";
import api, { Api } from "./api";
import { PrefetchContext } from "./prefetch";
import { REFRESH_USER, SET_PREFETCH_DATA } from "./store/types";
import createBlogApp, { mediaBreakpoints } from "./main";

const titleRE = new RegExp("<title>[^<]*</title>");
const noSSR = new RegExp("^/(?:edit|console)/");

// @ts-ignore isServer on prototype.
class ServerPrefetchContext extends PrefetchContext {

	readonly store: Store<any>;
	readonly route: RouteLocationNormalizedLoaded;
	readonly api: Api;
	readonly signal: AbortSignal;

	constructor(
		store: Store<any>,
		route: RouteLocationNormalizedLoaded,
		api: Api,
		signal: AbortSignal,
	) {
		super();
		this.store = store;
		this.route = route;
		this.api = api;
		this.signal = signal;
	}
}

ServerPrefetchContext.prototype.isServer = true;

/**
 * 简单地通过 User-Agent 判断客户端的设备是不是手机
 *
 * @param userAgent User-Agent
 * @return 如果是手机返回 true，否则 false
 */
function isMobile(userAgent: string) {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// noinspection JSUnusedGlobalSymbols 由服务器引用。
export default async (context: any) => {
	const { template, manifest, request, path } = context;

	if (noSSR.test(path)) {
		return template;
	}

	const { app, router, store } = createBlogApp();
	const ssrApi = api.withConfigProcessor(config => configureForProxy(request, config));

	// 从 UserAgent 中检测是否手机，从而设定渲染的屏幕宽度。
	const userAgent = request.headers["user-agent"];
	if (userAgent && isMobile(userAgent)) {
		store.commit(SET_WIDTH, mediaBreakpoints.mobile);
	}

	// router.push 返回的 Promise 等待所有 hooks 都调用完毕
	await router.push(path);
	// await router.isReady();

	const route = router.currentRoute.value;
	const controller = new AbortController();
	const session = new ServerPrefetchContext(store, route, ssrApi, controller.signal);

	/*
	 * 路由配置里最后一条把所有未匹配的路由都转到错误页，
	 * 故 router.getMatchedComponents() 不会返回空数组，也无法用其区分404.
	 * 目前的方案是在 error/Index.vue 里设置一个标识表示 NotFound.
	 */
	const tasks = route.matched
		.flatMap(v => Object.values(v.components) as any)
		.filter(c => c.asyncData)
		.map(c => c.asyncData(session));

	tasks.push(store.dispatch(REFRESH_USER, ssrApi));

	try {
		await Promise.all(tasks);
		store.commit(SET_PREFETCH_DATA, session.data);
	} catch (e) {
		controller.abort();

		switch (e.code) {
			case 404:
			case 410:
			case 429:
				await router.push("/error/" + e.code);
				break;
			default:
				throw e;
		}
	}

	const ssrContext: SSRContext = {
		meta: "<meta name='description' content='欢迎来到 Kaciras 的博客'>"
	};

	const { title } = route.meta;
	if (title) {
		ssrContext.title = `<title>${title} - Kaciras 的博客</title>`;
	}

	const appHtml = await renderToString(app, ssrContext);

	const initState = JSON.stringify(store.state);
	ssrContext.meta += `<script>window.__INITIAL_STATE__=${initState}</script>`

	const preloads = renderPreloadLinks(ssrContext.modules, manifest);

	let result = template;

	if (ssrContext.title) {
		result = result.replace(titleRE, ssrContext.title);
	}

	return result
		.replace("<!--ssr-metadata-->", ssrContext.meta ?? "")
		.replace("<!--app-html-->", appHtml)
		.replace("<!--preload-links-->", preloads);
};

/**
 * https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js
 *
 * @param modules
 * @param manifest
 */
function renderPreloadLinks(modules: any, manifest: any) {
	let links = "";
	const seen = new Set();
	modules.forEach((id: string) => {
		const files = manifest[id];
		if (files) {
			files.forEach((file: string) => {
				if (!seen.has(file)) {
					seen.add(file);
					const filename = basename(file);
					if (manifest[filename]) {
						for (const depFile of manifest[filename]) {
							links += renderPreloadLink(depFile);
							seen.add(depFile);
						}
					}
					links += renderPreloadLink(file);
				}
			});
		}
	});
	return links;
}

function renderPreloadLink(file: string) {
	if (file.endsWith(".js")) {
		return `<link rel="modulepreload" crossorigin href="${file}">`;
	} else if (file.endsWith(".css")) {
		return `<link rel="stylesheet" href="${file}">`;
	} else if (file.endsWith(".woff")) {
		return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
	} else if (file.endsWith(".woff2")) {
		return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
	} else if (file.endsWith(".gif")) {
		return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
	} else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
		return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
	} else if (file.endsWith(".png")) {
		return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
	} else {
		return "";
	}
}
