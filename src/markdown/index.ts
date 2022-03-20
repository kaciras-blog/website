import "./markdown.less";
import { Anchor, Classify, TOC, UGC } from "@kaciras-blog/markdown";
import MarkdownIt from "markdown-it";
import { escapeHtml } from "markdown-it/lib/common/utils.js";
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
articleRenderer.use(Anchor);
articleRenderer.use(TOC);
articleRenderer.use(Classify);
articleRenderer.use(clientMediaPlugin);

// 评论一般也不长，不需要 TOC；另外没有 Anchor 因为会冲突。
export const discussionRenderer = new MarkdownIt({ highlight });
discussionRenderer.use(Classify);
discussionRenderer.use(UGC);
discussionRenderer.use(clientMediaPlugin);
