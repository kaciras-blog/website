import "katex/dist/katex.css";
import "./markdown.less";
import MarkdownIt from "markdown-it";
import Anchor from "markdown-it-anchor";
import tableOfContent from "markdown-it-toc-done-right";
import katex from "@iktakahiro/markdown-it-katex";
import media from "@kaciras-blog/server/lib/markdown-media";
import lozad from "lozad";
import loadingImage from "@/assets/img/loading.gif";
import highlight from "./highlight";

/**
 * 给行内代码加个 inline-code 类以便跟代码块区别开
 *
 * @param markdownIt MarkdownIt的实例
 */
function inlineCodePlugin(markdownIt) {
	markdownIt.core.ruler.push("inline_code_class", state => state.tokens
		.filter(token => token.type === "inline")
		.forEach(token => token.children
			.filter(child => child.type === "code_inline")
			.forEach(child => child.attrs = [["class", "inline-code"]])));
}

/**
 * 修改图片的渲染输出的插件，具有以下两个功能：
 * 1. 给外层加上链接并设置居中的class
 * 2. 将图片的src改为data-src以便懒加载。
 *
 * @param markdownIt MarkdownIt的实例
 */
function lazyImagePlugin(markdownIt) {
	const defaultImageRenderer = markdownIt.renderer.rules.image;

	markdownIt.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const src = token.attrGet("src");
		token.attrPush(["data-src", src]);
		token.attrSet("src", loadingImage);

		const img = defaultImageRenderer(tokens, idx, options, env, self);

		return `
			<span class="center-wrapper">
				<a href="${src}" target="_blank">${img}</a>
				<span class="md-alt">${token.content}</span>
			</span>`;
	};
}

export const converter = new MarkdownIt({
	highlight: function (str, lang) {
		let result;
		if (lang && highlight.getLanguage(lang)) {
			result = highlight.highlight(lang, str).value;
		} else {
			result = converter.utils.escapeHtml(str);
		}
		return "<pre class='hljs'><code>" + result + "</code></pre>";
	},
});

// 【注意】
// 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
// 具体见 entry-client.js 中的 router.beforeEach 钩子。
converter.use(Anchor, {
	permalink: true,
	permalinkClass: "fas fa-link header-anchor",
	permalinkSymbol: "",

	// 参考 MSDN 的做法，有 aria-labelledby 情况下不再需要内容
	permalinkAttrs: (slug) => ({ "aria-labelledby": slug }),
});
converter.use(media);
converter.use(tableOfContent);
converter.use(katex);
converter.use(inlineCodePlugin);
converter.use(lazyImagePlugin);

/**
 * 将 Markdown 渲染为 HTML.
 *
 * @param markdown Markdown文本
 * @return {string} HTML文本
 */
export function renderMarkdown(markdown) {
	return converter.render(markdown);
}

/**
 * 对指定容器元素内的媒体启用懒加载，该函数只能在浏览器端调用。
 *
 * @param el 容器元素
 * @return 取消监听的函数，应当在被监视的内容被删除后调用，以避免内存泄漏。
 */
export function enableLazyLoad(el) {
	const images = lozad(el.querySelectorAll("img"));
	images.observe();

	const videos = new IntersectionObserver((entries) => {
		for (const { target, intersectionRatio } of entries) {
			intersectionRatio > 0 ? target.play() : target.pause();
		}
	});
	el.querySelectorAll("video").forEach(video => {
		videos.observe(video);

		// TODO: 累了不想改编译器，以后再说
		video.parentElement.classList.add("center-wrapper");
	});

	return function disconnect() {
		videos.disconnect();
		images.observer.disconnect();
	};
}
