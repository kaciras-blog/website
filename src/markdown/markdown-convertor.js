import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import Anchor from "markdown-it-anchor";

function detail(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];

	if (state.src.charAt(pos++) !== "$" || state.src.charAt(pos++) !== "[") {
		return false;
	}

	const token = state.push("detail", "detail", 0);
	return true;
}

const convertor = new MarkdownIt({
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

export default convertor;
