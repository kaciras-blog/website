import { basename, extname } from "path";
import { Store } from "vuex";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { renderToString, SSRContext } from "vue/server-renderer";
import { SET_WIDTH } from "@kaciras-blog/uikit";
import { configureForProxy } from "@kaciras-blog/server/lib/axios-helper.js";
import api, { Api } from "./api";
import { collectTasks, PrefetchContext } from "./prefetch";
import { REFRESH_USER, SET_PREFETCH_DATA } from "./store/types";
import createBlogApp, { mediaBreakpoints } from "./main";

const titleRE = new RegExp("<title>[^<]*</title>");

// 后台页面就不预渲染了。
const noSSR = new RegExp("^/(?:edit|console)/?(?:\\?|$)");

class ServerPrefetch extends PrefetchContext {

	readonly store: Store<any>;
	readonly route: RouteLocationNormalizedLoaded;
	readonly api: Api;
	readonly signal: AbortSignal;

	constructor(
		store: Store<any>,
		route: RouteLocationNormalizedLoaded,
		api: Api,
		controller: AbortController,
	) {
		super();
		this.store = store;
		this.route = route;
		this.api = api;
		this.signal = controller.signal;
	}
}

/**
 * 简单地通过 User-Agent 判断客户端的设备是不是手机
 *
 * @param userAgent User-Agent
 * @return 如果是手机返回 true，否则 false
 */
function isMobile(userAgent: string) {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

async function prefetch(store: Store<any>, router: Router, request: any) {
	const route = router.currentRoute.value;

	// 从 UserAgent 中检测是否手机，从而设定渲染的屏幕宽度。
	const userAgent = request.headers["user-agent"];
	if (userAgent && isMobile(userAgent)) {
		store.commit(SET_WIDTH, mediaBreakpoints.mobile);
	}

	const ssrApi = api.withConfig(c => configureForProxy(request, c));
	const controller = new AbortController();
	const session = new ServerPrefetch(store, route, ssrApi, controller);

	/*
	 * 路由配置里最后一条把所有未匹配的路由都转到错误页，
	 * 故 router.getMatchedComponents() 不会返回空数组，也无法用其区分404.
	 * 目前的方案是在 error/Index.vue 里设置一个标识表示 NotFound.
	 */
	const components = route.matched
		.flatMap(v => Object.values(v.components));

	const prefetching = collectTasks(components, session);

	try {
		await store.dispatch(REFRESH_USER, ssrApi);
		store.commit(SET_PREFETCH_DATA, await prefetching);
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
}

// noinspection JSUnusedGlobalSymbols 由服务器引用。
export default async (context: any) => {
	const { error, template, manifest, request, path } = context;

	if (noSSR.test(path)) {
		return template;
	}

	const { app, router, store } = createBlogApp();

	// router.push 返回的 Promise 等待所有 hooks 都调用完毕
	await router.push(error ? "/error/500" : path);
	await prefetch(store, router, request);

	const ssrContext: SSRContext = {
		meta: "<meta name='description' content='欢迎来到 Kaciras 的博客'>",
		title: router.currentRoute.value.meta.title,
	};

	const appHtml = await renderToString(app, ssrContext);

	const preloads = renderPreloadLinks(ssrContext.modules, manifest);
	const initState = JSON.stringify(store.state);
	context.status = ssrContext.status;

	// 加上 type="module" 相当于 defer，虽然代码不多但还是延迟一下吧。
	ssrContext.meta += `<script type="module">window.__INITIAL_STATE__=${initState}</script>`;

	let result = template;
	if (ssrContext.title) {
		const tag = `<title>${ssrContext.title} - Kaciras 的博客</title>`;
		result = result.replace(titleRE, tag);
	}
	return result
		.replace("<!--preload-links-->", preloads)
		.replace("<!--app-html-->", appHtml)
		.replace("<!--ssr-metadata-->", ssrContext.meta ?? "");
};

/**
 * 我感觉 Vite 这个清单有问题，它简单地把引用的文件作为页面需要的资源，这是错误的，
 * 因为并非引用了资源就一定会使用，而且第三方库里的资源也许首屏用不到但也包含了。
 *
 * <h2>设想的方案</h2>
 * 通过封 hook 资源元素 <img>、<video> 等等，应该能分析出哪些在首屏用到了，
 * CSS 里面的也能用 postcss 检查，这样可以更精确的预载。
 *
 * 代码参考：
 * https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js
 */
function renderPreloadLinks(modules: string[], manifest: Record<string, string[]>) {
	let links = "";
	const seen = new Set();

	for (const id of modules) {
		const files = manifest[id];
		if (!files) {
			continue;
		}
		for (const file of files) {
			if (seen.has(file)) {
				continue;
			}
			seen.add(file);
			const filename = basename(file);
			if (manifest[filename]) {
				for (const dep of manifest[filename]) {
					links += renderPreloadLink(dep);
					seen.add(dep);
				}
			}
			links += renderPreloadLink(file) ?? "";
		}
	}
	return links;
}

/**
 * 根据页面使用到的文件生成对应的预载链接，用于优化加载速度。
 *
 * <h2>Preload vs. Prefetch</h2>
 * Preload 预载当前页面必定会用到的资源，重要性比 Prefetch 高，如果没用到会显示警告。
 * Prefetch 指示未来可能用到的资源，当前页也许不会用，浏览器也可能忽略它。
 *
 * @param file 文件路径
 * @return 链接元素的 HTML，如果无需预载则为 undefined。
 */
function renderPreloadLink(file: string) {
	const ext = extname(file).slice(1);
	switch (ext) {
		case "js":
			return `<link rel="modulepreload" crossorigin href="${file}">`;
		case "css":
			return `<link rel="stylesheet" href="${file}">`;
		case "woff":
		case "woff2":
			return `<link rel="preload" href="${file}" as="font" type="font/${ext}" crossorigin>`;
		case "gif":
		case "png":
		case "jpeg":
		case "webp":
		case "avif":
			return `<link rel="prefetch" href="${file}" as="image" type="image/${ext}">`;
		case "jpg":
			return `<link rel="prefetch" href="${file}" as="image" type="image/jpeg">`;
	}
}
