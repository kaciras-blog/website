import "./markdown.less";
import MarkdownIt from "markdown-it";
import Anchor from "markdown-it-anchor";
import tableOfContent from "markdown-it-toc-done-right";
import katex from "@iktakahiro/markdown-it-katex";
import lozad from "lozad";
import highlight from "./highlight";
import loadingImage from "../assets/img/loading.gif";

/**
 * 给行内代码加个 inline-code 类以便跟代码块区别开
 *
 * @param markdownIt MarkdownIt的实例
 */
function inlineCodePlugin (markdownIt) {
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
function customImagePlugin(markdownIt) {
	const defaultImageRenderer = markdownIt.renderer.rules.image;

	markdownIt.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const srcValue = token.attrGet("src");
		token.attrPush(["data-src", srcValue]);
		token.attrSet("src", loadingImage);

		const wrapper = `<a href="${srcValue}" class="image-wrapper" target="_blank">`;
		return wrapper + defaultImageRenderer(tokens, idx, options, env, self) + "</a>";
	};
}

export const converter = new MarkdownIt({
	html: true,
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

// NOTICE: 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
//		   具体见 entry-client.js 中的 router.beforeEach 钩子。
converter.use(Anchor, {
	permalink: true,
	permalinkClass: "fas fa-link header-anchor",
	permalinkSymbol: "",
});
converter.use(tableOfContent);
converter.use(katex);
converter.use(inlineCodePlugin);
converter.use(customImagePlugin);

export default {
	install (Vue) {
		Vue.filter("markdownToHtml", text => converter.render(text));
	},
	/**
	 * 添加一些额外的交互状态，只能在浏览器端调用。
	 */
	afterConvert (el) {
		lozad(el.querySelectorAll("img")).observe();
	},
	renderHtml (text) {
		return converter.render(text);
	},
};
