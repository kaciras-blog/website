import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import Anchor from "markdown-it-anchor";

/**
 * MarkdownIt真不好用，也没个文档，想改都难，还是从外层搞，有时间自己撸个解析器。
 */
function myPlugin(markdownIt) {
	// markdownIt.block.ruler.before("paragraph", "detail", (state, startLine, endLine, silent) => {
	// 	let pos = state.bMarks[startLine] + state.tShift[startLine];
	// 	let token;
	// 	const oldParentType = state.parentType;
	//
	// 	if (state.src.charAt(pos++) !== "$" || state.src.charAt(pos++) !== "(") {
	// 		return false;
	// 	}
	//
	// 	const rb = state.skipChars(pos, ')'.charCodeAt(0));
	// 	if(rb < 0) {
	// 		return false;
	// 	}
	// 	const summary = state.src.slice(pos, rb);
	// 	pos += rb + 1;
	// 	if(state.src.charAt(pos++) !== "[") {
	// 		return false;
	// 	}
	//
	// 	let nextLine = startLine;
	// 	for (;;) {
	// 		nextLine++;
	// 		if (nextLine >= endLine) {
	// 			return false;
	// 		}
	//
	// 		pos = state.bMarks[nextLine] + state.tShift[nextLine];
	// 		const max = state.eMarks[nextLine];
	//
	// 		if (max - pos >= 2 && state.src.charAt(pos++) === "]" && state.src.charAt(pos++) === "$") {
	// 			state.line = nextLine + 1;
	//
	// 			token          = state.push('details_open', 'details', 1);
	// 			token.map      = [ startLine, state.line ];
	//
	// 			token          = state.push('inline', 'summary', 0);
	// 			token.content  = summary;
	//
	// 			token          = state.push('inline', '', 0);
	// 			token.content  = state.getLines(startLine + 1, nextLine, state.blkIndent, true);
	// 			token.map      = [ startLine, state.line ];
	// 			token.children = [];
	//
	// 			token          = state.push('details_close', 'details', -1);
	//
	// 			state.parentType = oldParentType;
	// 			return true;
	// 		}
	// 	}
	// });

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
		Vue.filter("markdownToHtml", text => {
			// Vue.$nextTick(afterConvert);
			return convertor.render(text);
		});
		Vue.component("KxMarkdownEditor", () => import("./Editor"));
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
