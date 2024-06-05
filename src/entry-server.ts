import type { RenderContext, SSRManifest } from "@kaciras-blog/server";
import { extname } from "path";
import { Router } from "vue-router";
import { renderToString, SSRContext } from "vue/server-renderer";
import { Pinia } from "pinia";
import { breakpoints, useMQStore } from "@kaciras-blog/uikit";
import { getProxyHeaders } from "@kaciras-blog/server/lib/fetch-helper";
import { compositor } from "@kaciras/utilities/browser";
import { useCurrentUser, usePrefetch } from "@/store/index.ts";
import api from "./api/index.ts";
import createBlogApp from "./main.ts";
import { collectTasks, PrefetchContext } from "./prefetch.ts";
import { getHeadTagsSSR } from "@/components/HeadTags.ts";

// 后台页面就不预渲染了。
const noSSR = new RegExp("^/(?:edit|console)/?(?:\\?|$)?");

/**
 * 简单地通过 User-Agent 判断客户端的设备是不是手机
 *
 * @param userAgent User-Agent
 * @return 如果是手机返回 true，否则 false
 */
function isMobile(userAgent: string) {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

async function prefetch(store: Pinia, router: Router, request: any) {
	const route = router.currentRoute.value;

	// 从 UserAgent 中检测是否手机，从而设定渲染的屏幕宽度。
	const userAgent = request.headers["user-agent"];
	if (userAgent && isMobile(userAgent)) {
		useMQStore(store).width = breakpoints.mobile;
	}

	const controller = new AbortController();
	const ssrApi = api.configure({
		signal: controller.signal,
		headers: getProxyHeaders(request),
	});
	const ctx = new PrefetchContext(store, route, ssrApi, controller);

	/*
	 * 路由配置里最后一条把所有未匹配的路由都转到错误页，
	 * 故 router.getMatchedComponents() 不会返回空数组，也无法用其区分404.
	 * 目前的方案是在 error/Index.vue 里设置一个标识表示 NotFound.
	 */
	const components = route.matched
		.flatMap(v => Object.values(v.components!));

	const prefetching = collectTasks(components, ctx);

	const userStore = useCurrentUser(store);
	const prefetch = usePrefetch(store);

	try {
		// 不能分开等待，如果这样写 refresh 出错时 prefetching 的异常无法捕获，导致进程退出。
		// await userStore.refresh(ssrApi);
		// prefetch.data = await prefetching;

		const results = await Promise.all([
			prefetching,
			userStore.refresh(ssrApi),
		]);
		prefetch.data = results[0];
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

/**
 * 服务端渲染的入口，该函数将由支持 SSR 的服务器调用。
 *
 * @param template HTML 模板
 * @param manifest 模块到依赖的资源的清单
 */
export default function (template: string, manifest?: SSRManifest) {
	const newComposite = compositor(template, {
		metadata: "<!--ssr-metadata-->",
		headTags: "<!--seo-head-tags-->",
		title: /(?<=<title>).*(?=<\/title>)/s,
		preloads: /(?=<\/head>)/s,
		bodyAttrs: /(?<=<body.*?)(?=>)/s,
		appHtml: /(?<=<body.*?>).*(?=<\/body>)/s,
	});

	return async (context: RenderContext) => {
		const { error, request, path } = context;

		if (noSSR.test(path)) {
			return template;
		}

		const { app, router, store } = createBlogApp();

		// router.push 返回的 Promise 等待所有 hooks 都调用完毕
		await router.push(error ? "/error/500" : path);
		await prefetch(store, router, request);

		const ssrContext: SSRContext = {
			title: "Kaciras Blog",
		};

		const appHtml = await renderToString(app, ssrContext);
		context.status = ssrContext.status;

		// TODO: 这地方处理两次好麻烦，有没有更好地设计？
		const data = JSON.stringify(store.state.value, null, "\t")
			.replaceAll("</script>", "<\\/script>");
		ssrContext.meta = `<script>window.__INITIAL_STATE__=${data}</script>`;

		const { title, modules, meta, bodyClass = "" } = ssrContext;
		const composite = newComposite();
		if (manifest) {
			composite.put("preloads", preloads(modules, manifest));
		}
		composite.put("appHtml", appHtml);
		composite.put("title", title);
		composite.put("metadata", meta);
		composite.put("bodyAttrs", ` class="${bodyClass}"`);
		composite.put("headTags", getHeadTagsSSR(ssrContext));
		return composite.toString();
	};
}

/**
 * 我感觉 Vite 这个清单有问题，它简单地把引用的文件作为页面需要的资源，这是错误的，
 * 因为并非引用了资源就一定会使用，而且第三方库里的资源也许首屏用不到但也包含了。
 *
 * 代码参考：
 * https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js
 */
function preloads(modules: Set<string>, manifest: SSRManifest) {
	const chunkSet = new Set<string>();
	const depSet = new Set<string>();
	const preloadLinks: Array<string | undefined> = [];

	for (const module of modules) {
		const chunk = manifest.modules[module];
		if (!chunk || chunkSet.has(chunk)) {
			continue;
		}
		chunkSet.add(chunk);
		for (const dep of manifest.chunks[chunk]) {
			if (depSet.has(dep)) {
				continue;
			}
			depSet.add(dep);
			preloadLinks.push(renderPreloadLink(dep));
		}
	}
	return preloadLinks.filter(Boolean).join("");
}

/**
 * 根据页面使用到的文件生成对应的预载链接，用于优化加载速度。
 *
 * # Preload vs. Prefetch
 * Preload 预载当前页面必定会用到的资源，重要性比 Prefetch 高，如果没用到会显示警告。
 * Prefetch 指示未来可能用到的资源，当前页也许不会用，浏览器也可能忽略它。
 *
 * # modulepreload 无用
 * 该属性相当于 JS 的 Preload，是为了冰雪加载立即要用但却被切分出去的文件。
 * 而本项目中的异步模块均是为优化性能而切出去的，不会在首屏用到，预载反而挤占带宽。
 * 这些资源应该用 Prefetch 做低优先级预载，但可惜没有 moduleprefetch。
 *
 * @param file 文件路径
 * @return 链接元素的 HTML，如果无需预载则为 undefined。
 */
function renderPreloadLink(file: string) {
	const ext = extname(file).slice(1);
	switch (ext) {
		case "css":
			return `<link rel="stylesheet" href="${file}">`;
		case "woff":
		case "woff2":
			return `<link rel="preload" href="${file}" as="font" type="font/${ext}" crossorigin>`;
	}
}
