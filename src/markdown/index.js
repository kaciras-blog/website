import "katex/dist/katex.css";
import "./markdown.less";
import MarkdownIt from "markdown-it";
import Anchor from "markdown-it-anchor";
import tableOfContent from "markdown-it-toc-done-right";
import katex from "@iktakahiro/markdown-it-katex";
import { clientMediaPlugin } from "./media";
import highlight from "./highlight";

export { initLazyLoading } from "./media";

export const renderer = new MarkdownIt({
	highlight(str, lang) {
		let result;
		if (lang && highlight.getLanguage(lang)) {
			result = highlight.highlight(lang, str).value;
		} else {
			result = renderer.utils.escapeHtml(str);
		}
		return "<pre class='hljs'><code>" + result + "</code></pre>";
	},
});

// 【Vue-Router 兼容性】
// 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
// 具体见 entry-client.js 中的 router.beforeEach 钩子。
renderer.use(Anchor, {
	permalink: true,
	permalinkClass: "fas fa-link header-anchor",
	permalinkSymbol: "",

	// 参考 MSDN 网站的做法，有 aria-labelledby 情况下不再需要内容
	permalinkAttrs: (slug) => ({ "aria-labelledby": slug }),
});
renderer.use(tableOfContent);
renderer.use(katex);
renderer.use(clientMediaPlugin);

/**
 * 给行内代码加个 inline-code 类以便跟代码块区别开
 */
renderer.core.ruler.push("inline_code_class", state => state.tokens
	.filter(token => token.type === "inline")
	.forEach(token => token.children
		.filter(child => child.type === "code_inline")
		.forEach(child => child.attrs = [["class", "inline-code"]])));

/**
 * 将 Markdown 渲染为 HTML.
 *
 * @param markdown Markdown文本
 * @return {string} HTML文本
 */
export function renderMarkdown(markdown) {
	return renderer.render(markdown);
}
