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

		Vue.directive("bind-selection", {
			inserted(el, { expression, modifiers }, vnode) {
				const vm = vnode.context;
				vm.$watch(expression, nv => {
					const [s, e] = nv;
					el.selectionStart = s;
					el.selectionEnd = e;
					if (modifiers.focus) el.focus();
				});
			},
		});

		Vue.directive("on-selection", {
			inserted(el, { expression }, vnode) {
				const vm = vnode.context;

				let oldStart = el.selectionStart;
				let oldEnd = el.selectionEnd;

				function handleSelect() {
					const { selectionStart, selectionEnd } = el;
					if (oldStart !== selectionStart || oldEnd !== selectionEnd) {
						oldStart = selectionStart;
						oldEnd = selectionEnd;
						vm[expression](selectionStart, selectionEnd);
					}
				}

				el.addEventListener("click", handleSelect);		// 鼠标点击改变光标位置
				el.addEventListener("input", handleSelect);		// 增删内容改变光标位置
				el.addEventListener("keyup", handleSelect);		// Home,End,PageUp,PageDown
				el.addEventListener("keydown", handleSelect);	// 移动光标的键按住不放
			},
		});
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
