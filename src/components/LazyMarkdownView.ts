import { defineAsyncComponent } from "vue";

/**
 * 为了拆分庞大的 Markdown 转换器，必须把这个组件搞成异步的。
 */
const LazyMarkdownView = defineAsyncComponent(() => import("@kaciras-blog/markdown-vue/view"));

export default LazyMarkdownView;

/**
 * 预载 MarkdownView 和依赖的 Markdown 转换器。推荐在顶层统一的加载函数里调用，避免后续渲染出现闪烁。
 *
 * 这里使用了 Vue 的私有 API，更新依赖后可能产生问题，需要注意。
 *
 * 异步组件有缓存机制，已加载完毕的话以后就直接同步渲染。
 * https://github.com/vuejs/core/blob/a0e7dc334356e9e6ffaa547d29e55b34b9b8a04d/packages/runtime-core/src/apiAsyncComponent.ts#L70
 */
export const prefetchMarkdownView = LazyMarkdownView.__asyncLoader;
