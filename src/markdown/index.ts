import "./markdown.less";
import { Anchor, Classify, Footnote, TOC, UGC } from "@kaciras-blog/markdown";
import MarkdownIt from "markdown-it";
import highlight, { activateCopyButtons } from "./highlight";
import { clientMediaPlugin, observeLazyLoad } from "./media";

export const articleRenderer = new MarkdownIt();
articleRenderer.use(highlight);
articleRenderer.use(Anchor);
articleRenderer.use(Footnote);
articleRenderer.use(TOC);
articleRenderer.use(Classify);
articleRenderer.use(clientMediaPlugin);

// 评论一般也不长，不需要 TOC；另外没有 Anchor 因为会冲突。
export const discussionRenderer = new MarkdownIt();
discussionRenderer.use(highlight);
discussionRenderer.use(Footnote);
discussionRenderer.use(Classify);
discussionRenderer.use(UGC);
discussionRenderer.use(clientMediaPlugin);

/**
 * 激活 Markdown 元素，其实就是添加各种监听，卸载后记得清理哦。
 */
export function activate(el: HTMLElement) {
	activateCopyButtons(el);
	return observeLazyLoad(el);
}
