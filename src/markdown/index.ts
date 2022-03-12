import "./markdown.less";
import MarkdownIt from "markdown-it";
import { escapeHtml } from "markdown-it/lib/common/utils.js";
import { Anchor, TOC, UGC } from "@kaciras-blog/markdown";
import highlight from "./highlight";
import { clientMediaPlugin, initLazyLoading } from "./media";

export { initLazyLoading };

function highlightCodeBlock(code: string, language: string) {
	let result;
	if (language && highlight.getLanguage(language)) {
		result = highlight.highlight(code, { language }).value;
	} else {
		result = escapeHtml(code);
	}
	return `<pre class='hljs'><code>${result}</code></pre>`;
}

function createRenderer() {
	const markdownIt = new MarkdownIt({ highlight: highlightCodeBlock });
	markdownIt.use(clientMediaPlugin);

	const { rules } = markdownIt.renderer;
	const raw = rules.code_inline!;

	/**
	 * 给行内代码加个 inline-code 类以便跟代码块区别开
	 */
	rules.code_inline = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		token.attrs = [["class", "inline-code"]];
		return raw(tokens, idx, options, env, self);
	};

	return markdownIt;
}

export const articleRenderer = createRenderer();
export const discussionRenderer = createRenderer();

/*
 * 只有文章才添加导航锚，评论就不用了。
 *
 * 【Vue-Router 兼容性】
 * 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
 * 具体见 entry-client.ts 中的 router.beforeEach 钩子。
 */
articleRenderer.use(Anchor);
articleRenderer.use(TOC);

// 评论一般也不长，不需要 TOC
discussionRenderer.use(UGC);
