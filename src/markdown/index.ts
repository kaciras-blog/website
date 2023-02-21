import { defineAsyncComponent } from "vue";
import { activateCopyButtons } from "./fence";
import { observeLazyLoad } from "./lazy-loading";

/**
 * 激活 Markdown 元素，其实就是添加各种监听，卸载后记得清理哦。
 */
export function activate(el: HTMLElement) {
	activateCopyButtons(el);
	return observeLazyLoad(el);
}

export const LazyMarkdownView = defineAsyncComponent(() => import("./MarkdownView.vue"));

export const preloadMDView = LazyMarkdownView.__asyncLoader;
