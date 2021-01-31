import lozad from "lozad";
import media, { RendererMap } from "@kaciras-blog/server/lib/markdown-media";
import Token from "markdown-it/lib/token";
import MarkdownIt from "markdown-it";

/**
 * 从资源的链接参数（?vw=...&vh=...）里读取媒体的尺寸，
 * 生成防抖容器的 class 和 style 属性。
 *
 * @param url 资源的链接
 * @return class 和 style 属性字符串
 */
function getContainerClassAndStyle(url: string) {
	const urlParams = new URLSearchParams(url.split("?")[1]);

	// parseFloat(null) 返回 NaN 也是可以的
	const width = parseFloat(urlParams.get("vw")!);
	const height = parseFloat(urlParams.get("vh")!);

	if (!(width && height)) {
		return 'class="md-media-container"';
	}

	const ratio = height / width * 100;
	const style = `--width:${width}px; --aspect-ratio:${ratio}%`;

	return `class="md-media-container sized" style="${style}"`;
}

/**
 * 自定义图片的渲染。
 *
 * 【防止布局抖动】
 * 通过 URL 里携带的宽高信息，设置图片的大小和宽高比，防止加载后元素尺寸的变化。
 * 下面的 GIF 视频同理。
 *
 * 详细的原理见：
 * https://blog.kaciras.com/article/18/add-video-support-to-markdown
 *
 * 【关于加载菊花图】
 * 图片本身就有在不完全加载的时的显示方式，比如从上往下显示或者渐进式图片。
 * 对于完全无法加载的情况，下面的标签也能表明空白区域是图片。
 * 所以没有必要使用加载指示器（菊花图）来让用户等到图片完全载入。
 */
function renderImage(tokens: Token[], idx: number) {
	const token = tokens[idx];
	const src = token.attrGet("src") || "";
	const alt = token.content;

	return `
		<span class="center-wrapper">
			<a
				${getContainerClassAndStyle(src)}
				href="${src}"
				target="_blank"
				rel="noopener,nofollow"
			>
				<img data-src="${src}" alt="${alt}" class="md-img">
			</a>
			${alt ? `<span class="md-img-alt">${alt}</span>` : ""}
    	</span>
	`;
}

/**
 * 各种自定义指令在本站页面的渲染实现。
 */
const directiveMap: RendererMap = {
	// 大部分浏览器只允许无声视频自动播放，不过GIF视频本来就是无声的。
	gif(src, alt) {
		return `
			<p class="center-wrapper">
				<span ${getContainerClassAndStyle(src)}>
					<video class="gif" src="${src}" loop muted></video>
				</span>
				${alt ? `<span class="md-img-alt">${alt}</span>` : ""}
    		</p>
		`;
	},
	video(src, poster, md) {
		poster = md.normalizeLink(poster);
		if (!md.validateLink(poster)) {
			poster = "";
		}
		return `
			<p class="center-wrapper md-video">
				<span class="md-media-container sized">
					<video poster="${poster}" src="${src}" controls></video>
				</span>
			</p>
		`;
	},
	audio(src) {
		return `<p class="center-wrapper"><audio controls src=${src}></audio></p>`;
	},
};

/**
 * MarkdownIt 的插件，使用方式：markdownIt.use(clientMediaPlugin)
 *
 * @param markdownIt 要安装的实例
 */
export function clientMediaPlugin(markdownIt: MarkdownIt) {
	markdownIt.use(media, directiveMap);
	markdownIt.renderer.rules.image = renderImage;
}

/**
 * 对指定容器元素内的媒体启用懒加载，该函数只能在浏览器端调用。
 *
 * 【Reader View 兼容性】
 * JS实现的懒加载在浏览器的阅读视图里无法工作，唯一的方案是用 loading="lazy"，
 * 但该属性兼容性还不行。
 * 故不建议使用阅读视图浏览本站的文章，本站的文章页面已经足够简洁。
 *
 * @param el 容器元素
 * @return {function} 取消监听的函数，在被监视的元素移除后调用，以避免内存泄漏。
 */
export function initLazyLoading(el: HTMLElement) {
	const lozadImages = lozad(el.querySelectorAll("img"));
	lozadImages.observe();

	// gif 视频自动播放/暂停
	const autoPlay = new IntersectionObserver(entries => {
		for (const entry of entries) {
			const target = entry.target as HTMLVideoElement;
			/*
			 * play 返回 Promise 来加等待加载完成，如果元数据还未加载完就暂停会抛出异常。
			 * 这个异常在 Chrome 里是 AbortError，Firefox 是 DomException，无法很好地跟其他情况区分。
			 *
			 * 但元数据的加载被中断是正常的，不影响下次播放，故直接屏蔽掉异常免得控制台里难看。
			 *
			 * https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
			 */
			entry.intersectionRatio > 0 ? silencePromise(target.play()) : target.pause();
		}
	});

	el.querySelectorAll(".gif").forEach(video => autoPlay.observe(video));

	return function disconnect() {
		autoPlay.disconnect();
		lozadImages.observer.disconnect();
	};
}

/**
 * 屏蔽 Promise 的异常，防止某些无关紧要的错误出现在控制台里。
 *
 * 【本代码抄自】
 * https://github.com/videojs/video.js/blob/main/src/js/utils/promise.js
 *
 * @param value An object that may or may not be `Promise`-like.
 */
function silencePromise(value: any) {
	if (value && typeof value.then === "function") {
		value.catch(() => {});
	}
}
