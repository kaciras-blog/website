import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import x from "markdown-it-anchor";

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
		if (lang && hljs.getLanguage(lang)) {
			try {
				return "<pre class='hljs'><code>" + hljs.highlight(lang, str).value + "</code></pre>";
			} catch (__) {
			}
		}
		return "<pre class='hljs'><code>" + convertor.utils.escapeHtml(str) + "</code></pre>";
	},
});
convertor.use(x, {
	permalink: true,
});

export default convertor.render;
