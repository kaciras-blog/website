/*
 * TODO: lozad 只有很少的代码，并且其功能也不是很强，考虑以后自己实现
 */
import MarkdownIt from "markdown-it";
import highlight from "./highlight";
import Anchor from "markdown-it-anchor";
import lozad from "lozad";
import loadingImage from "../assets/img/loading.gif";
import katex from "@iktakahiro/markdown-it-katex";
import tableOfContent from "markdown-it-toc-done-right";


function myPlugin (markdownIt) {

	// 给行内代码加个class
	markdownIt.core.ruler.push("inline_code_class", state => state.tokens
		.filter(token => token.type === "inline")
		.forEach(token => token.children
			.filter(child => child.type === "code_inline")
			.forEach(child => child.attrs = [["class", "inline-code"]])));

	// 自定义图片，外层加上链接并设置居中的class
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
converter.use(myPlugin);


export default {
	install (Vue) {
		Vue.filter("markdownToHtml", text => converter.render(text));
	},
	/**
	 * 添加一些额外的交互状态，只能在浏览器端调用。
	 */
	afterConvert () {
		lozad(document.querySelectorAll(".markdown img")).observe();
	},
	renderHtml (text) {
		return converter.render(text);
	},
};
