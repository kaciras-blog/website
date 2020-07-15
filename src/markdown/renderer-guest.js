/**
 * 处理第三方用户输入的 MarkdownIt 插件，用于评论等。
 *
 * @param markdownIt 要安装的实例
 */
export default function guestPlugin(markdownIt) {
	const raw = markdownIt.renderer.renderToken;

	/**
	 * 用户的输入的链接必须加个 rel="nofollow" 防止滥用。
	 * https://support.google.com/webmasters/answer/96569?hl=zh-Hans
	 */
	markdownIt.renderer.renderToken = function (tokens, idx, options, env, self) {
		const token = tokens[idx];
		if (token.type === "link_open") {
			token.attrPush(["rel", "ugc,nofollow"]);
		}
		return raw.call(this, tokens, idx, options, env, self);
	};
}
