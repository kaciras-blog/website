import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import Anchor from "markdown-it-anchor";


function myPlugin(markdownIt) {

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

convertor.use(myPlugin);

export default {
	install(Vue) {
		Vue.filter("markdownToHtml", text => convertor.render(text));
	},
	afterConvert() {
		const images = document.querySelectorAll(".markdown img");
		for (let node of images) {
			const p = node.parentNode;
			if (p.childNodes.length === 1) p.classList.add("image-wrapper");
		}
	},
	renderHtml(text) {
		return convertor.render(text);
	},
};
