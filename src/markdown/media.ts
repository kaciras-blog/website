import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token";
import { DirectiveMap, Media } from "@kaciras-blog/markdown";
import { $HTML } from "@/utils";

/**
 * 从资源的链接参数（?vw=...&vh=...）里读取尺寸，生成防抖容器的 style 属性。
 *
 * @param url 资源的链接
 * @return style 属性字符串
 */
function getSizeStyle(url: string) {
	const urlParams = new URLSearchParams(url.split("?")[1]);

	// parseFloat(null) 返回 NaN 也是可以的
	const width = parseFloat(urlParams.get("vw")!);
	const height = parseFloat(urlParams.get("vh")!);

	if (!(width && height)) {
		return "";
	}
	return `style='--width:${width}px; --aspect:${width}/${height}'`;
}

/**
 * 自定义图片的渲染，相比默认的来说多了标签元素、懒加载、以及居中。
 *
 * 【不用 figure 元素】
 * <figure> 介绍里提到即使移除也不影响 main flow，但文章里的图可能跟上下文联系紧密，
 * 似乎并不能代替 <img> + <span>。
 *
 * 【防止布局抖动】
 * 通过 URL 里携带的宽高信息，设置图片的大小和宽高比，防止加载后元素尺寸的变化。
 * 下面的 GIF 视频同理。
 *
 * 详细的原理见：
 * https://blog.kaciras.com/article/18/add-video-support-to-markdown
 *
 * 【加载指示器】
 * 图片本身就有在不完全加载的时的显示方式，比如从上往下显示或者渐进式图片。
 * 如果无法加载，下面的标签也能表明空白区域是图片，所以没有必要用菊花图。
 */
function renderImage(this: MarkdownIt, tokens: Token[], idx: number) {
	const token = tokens[idx];
	const src = token.attrGet("src") ?? "";
	const label = this.utils.escapeHtml(token.content);

	// 【注意】MarkdownIt 遵守 CommonMark 规范对单引号不转义，所以 alt 必须用双引号。
	return $HTML`
		<span class='center-wrapper'>
			<a
				${getSizeStyle(src)}
				href="${src}"
				target='_blank'
				rel='noopener,nofollow'
			>
				<img data-src="${src}" alt="${label}" class='md-img' crossorigin>
			</a>
			${label ? `<span class='md-alt'>${label}</span>` : ""}
		</span>
	`;
}

/**
 * 各种自定义指令在本站页面的渲染实现，渲染出来的 HTML 必须配合下面的懒加载使用。
 *
 * 对于其它的环境，比如 RSS，使用的是另外的渲染方案。
 */
const directiveMap: DirectiveMap = {
	// 大部分浏览器只允许无声视频自动播放，不过 GIF 视频本来就是无声的。
	gif(src, alt, md) {
		return $HTML`
			<p class='center-wrapper' ${getSizeStyle(src)}>
				<video
					class='gif'
					crossorigin
					loop
					muted
					data-src="${src}"
				/>
				${alt ? `<span class='md-alt'>${alt}</span>` : ""}
			</p>
		`;
	},
	video(src, poster, md) {
		poster = md.normalizeLink(poster);
		if (!md.validateLink(poster)) {
			poster = "";
		}
		return $HTML`
			<p class='center-wrapper'>
				<video 
					class='md-video'
					controls
					crossorigin
					poster="${poster}"
					data-src="${src}"
				/>
			</p>
		`;
	},
	audio(src) {
		return $HTML`
			<p class='center-wrapper'>
				<audio controls src="${src}" crossorigin/>
			</p>`;
	},
};

/**
 * 自定义媒体元素的前端版，覆盖 Media 插件和默认的图片渲染器，
 * 在这里，媒体将被渲染成具有更复杂的布局的元素，同时还启用了延迟加载。
 */
export function clientMediaPlugin(markdownIt: MarkdownIt) {
	markdownIt.use(Media, directiveMap);
	markdownIt.renderer.rules.image = renderImage.bind(markdownIt);
}
