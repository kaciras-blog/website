import "katex/dist/katex.css";
import "./markdown.less";
import MarkdownIt, { Options } from "markdown-it";
import { escapeHtml } from "markdown-it/lib/common/utils";
import Anchor, { AnchorOptions } from "markdown-it-anchor";
import tableOfContent from "markdown-it-toc-done-right";
import katex from "@iktakahiro/markdown-it-katex";
import highlight from "./highlight";
import { clientMediaPlugin, initLazyLoading } from "./media";
import guestPlugin from "./renderer-guest";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";

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
	markdownIt.use(katex);
	markdownIt.use(clientMediaPlugin);

	const { rules } = markdownIt.renderer;
	const raw = rules.code_inline!;

	/**
	 * 给行内代码加个 inline-code 类以便跟代码块区别开
	 */
	rules.code_inline = (tokens: Token[], idx: number, options: Options, env: any, self: Renderer) => {
		const token = tokens[idx];
		token.attrs = [["class", "inline-code"]]
		return raw(tokens, idx, options, env, self);
	};

	return markdownIt;
}

export const articleRenderer = createRenderer();

// 评论一般也不长，不需要TOC
articleRenderer.use(tableOfContent);

/*
 * 只有文章才添加导航锚，评论就不用了。
 *
 * 【Vue-Router 兼容性】
 * 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
 * 具体见 entry-client.ts 中的 router.beforeEach 钩子。
 */
articleRenderer.use<AnchorOptions>(Anchor, {

	/*
 	 * vue-router 2 使用 document.querySelector(position.selector) 不支持 URL 编码的 hash 片段，
 	 * 而且仅对数字开头的选择器才改用 getElementById，这导致无法滚动到中文标题。
 	 *
 	 * 不过这个 BUG 在 vue-router 3 中修复了，新版对 # 开头都都用 getElementById。
 	 * https://github.com/vuejs/vue-router/issues/3008#issuecomment-634094481
 	 *
 	 * 当前版本为了解决这个问题，修改了 scrollBehavior 和这里的 id 生成方式。
 	 *
 	 * 此处的 slugify 不使用 encodeURIComponent，而在 href 里才编码，保证元素的 id 不含无法用于 querySelector 的字符，
 	 * 然后 router 的 scrollBehavior 里将 hash 解码为原始的中文，这样就规避了这个BUG。
	 */
	slugify: title => title.trim().toLowerCase().replace(/\s+/g, "-"),
	permalinkHref: slug => `#${encodeURIComponent(slug)}`,

	permalink: true,
	permalinkClass: "fas fa-link anchor-link",
	permalinkSymbol: "",

	// 参考 MSDN 网站的做法，有 aria-labelledby 情况下不再需要内容
	permalinkAttrs: slug => ({ "aria-labelledby": slug }),
});

export const discussionRenderer = createRenderer();

discussionRenderer.use(guestPlugin);
