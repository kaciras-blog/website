import "./markdown.less";
import MarkdownIt from "markdown-it";
import { escapeHtml } from "markdown-it/lib/common/utils";
import Anchor from "markdown-it-anchor";
import tableOfContent from "markdown-it-toc-done-right";
import highlight from "./highlight";
import { clientMediaPlugin, initLazyLoading } from "./media";
import guestPlugin from "./renderer-guest";

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
		token.attrs = [["class", "inline-code"]]
		return raw(tokens, idx, options, env, self);
	};

	return markdownIt;
}

export const articleRenderer = createRenderer();

// 评论一般也不长，不需要 TOC
articleRenderer.use(tableOfContent);

/*
 * 只有文章才添加导航锚，评论就不用了。
 *
 * 【Vue-Router 兼容性】
 * 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
 * 具体见 entry-client.ts 中的 router.beforeEach 钩子。
 */
articleRenderer.use<Anchor.AnchorOptions>(Anchor, {

	// 参考 MSDN 网站的做法，有 aria-labelledby 情况下不再需要内容
	permalink: Anchor.permalink.linkInsideHeader({
		placement: "after",
		ariaHidden: true,
		class: "anchor-link",
	}),

	slugify: title => title.trim().toLowerCase().replace(/\s+/g, "-"),
});

export const discussionRenderer = createRenderer();

discussionRenderer.use(guestPlugin);
