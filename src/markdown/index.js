/*
 * TODO: markdown-it-lazy-image 和 lozad 都只有很少的代码，并且其功能也不是很强，考虑以后自己实现
 */
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import Anchor from "markdown-it-anchor";
import lazyImage from "markdown-it-lazy-image";
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
}

export const convertor = new MarkdownIt({
	highlight: function (str, lang) {
		let result;
		if (lang && hljs.getLanguage(lang)) {
			result = hljs.highlight(lang, str).value;
		} else {
			result = convertor.utils.escapeHtml(str);
		}
		return "<pre class='hljs'><code>" + result + "</code></pre>";
	},
});

convertor.use(Anchor, {
	permalink: true,
	permalinkClass: "fas fa-link header-anchor",
	permalinkSymbol: "",
});
convertor.use(tableOfContent);
convertor.use(katex);
convertor.use(lazyImage, { placeholder: loadingImage });
convertor.use(myPlugin);

export default {
	install (Vue) {
		Vue.filter("markdownToHtml", text => convertor.render(text));
	},
	/**
	 * 添加一些额外的交互状态，只能在浏览器端调用。
	 */
	afterConvert () {
		const images = document.querySelectorAll(".markdown img");
		for (const node of images) {
			const p = node.parentNode;
			if (p.childNodes.length === 1) {
				p.classList.add("image-wrapper");
				node.addEventListener("click", e => this.$emit("enlarge-image", e.target));
			}
		}
		lozad(images).observe();
	},
	renderHtml (text) {
		return convertor.render(text);
	},
};
