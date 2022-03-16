import "./markdown.less";
import MarkdownIt from "markdown-it";
import { escapeHtml } from "markdown-it/lib/common/utils.js";
import { Anchor, Classify, TOC, UGC } from "@kaciras-blog/markdown";
import hljs from "./highlight";
import { clientMediaPlugin, initLazyLoading } from "./media";

export { initLazyLoading };

function highlight(code: string, language: string) {
	let result;
	if (language && hljs.getLanguage(language)) {
		result = hljs.highlight(code, { language }).value;
	} else {
		result = escapeHtml(code);
	}
	return `<pre class='hljs'><code>${result}</code></pre>`;
}

export const articleRenderer = new MarkdownIt({ highlight });
export const discussionRenderer = new MarkdownIt({ highlight });

/*
 * 只有文章才添加导航锚，评论就不用了。
 *
 * 【Vue-Router 兼容性】
 * 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
 * 具体见 entry-client.ts 中的 router.beforeEach 钩子。
 */
articleRenderer.use(Anchor);
articleRenderer.use(TOC);
articleRenderer.use(Classify);
articleRenderer.use(clientMediaPlugin);

// 评论一般也不长，不需要 TOC
discussionRenderer.use(Classify);
discussionRenderer.use(UGC);
discussionRenderer.use(clientMediaPlugin);
