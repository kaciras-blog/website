import { Media, RendererMap } from "@kaciras-blog/markdown";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import { silencePromise } from "@/utils";

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
		return "class='md-media-container'";
	}

	const ratio = height / width * 100;
	const style = `--width:${width}px; --aspect-ratio:${ratio}%`;

	return `class='md-media-container sized' style='${style}'`;
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
 * 【加载指示器（菊花图）】
 * 图片本身就有在不完全加载的时的显示方式，比如从上往下显示或者渐进式图片。
 * 如果无法加载，下面的标签也能表明空白区域是图片，所以没有必要使用指示器。
 */
function renderImage(tokens: Token[], idx: number) {
	const token = tokens[idx];
	const src = token.attrGet("src") || "";
	const alt = token.content;

	return `
		<span class='center-wrapper'>
			<a
				${getContainerClassAndStyle(src)}
				href='${src}'
				target='_blank'
				rel='noopener,nofollow'
			>
				<img data-src='${src}' alt='${alt}' class='md-img' crossorigin>
			</a>
			${alt ? `<span class='md-img-alt'>${alt}</span>` : ""}
    	</span>
	`;
}

/**
 * 各种自定义指令在本站页面的渲染实现，渲染出来的 HTML 必须配合下面的懒加载使用。
 *
 * 对于其它的环境，比如 RSS，使用的是另外的渲染方案。
 */
const directiveMap: RendererMap = {
	// 大部分浏览器只允许无声视频自动播放，不过 GIF 视频本来就是无声的。
	gif(src, alt) {
		return `
			<p class='center-wrapper'>
				<span ${getContainerClassAndStyle(src)}>
					<video class='gif' data-src='${src}' loop muted crossorigin></video>
				</span>
				${alt ? `<span class='md-img-alt'>${alt}</span>` : ""}
    		</p>
		`;
	},
	video(src, poster, md) {
		poster = md.normalizeLink(poster);
		if (!md.validateLink(poster)) {
			poster = "";
		}
		return `
			<p class='center-wrapper md-video'>
				<span class='md-media-container sized'>
					<video poster='${poster}' data-src='${src}' controls crossorigin></video>
				</span>
			</p>
		`;
	},
	audio(src) {
		return `
			<p class='center-wrapper'>
				<audio controls src=${src} crossorigin></audio>
			</p>`;
	},
};

type OnIntersect = (target: any, isInView: boolean) => void;

interface CodecSupportDetector {
	_codecs?: string;

	_supportedCodecs(el: HTMLVideoElement): string;
}

const lazyHandlers: Record<string, OnIntersect> & CodecSupportDetector = {

	/**
	 * 检测浏览器支持的新一代视频编码，新一代指在 AVC 之后，压缩率更好且收到广泛支持的。
	 *
	 * [查看浏览器支持哪些](https://cconcolato.github.io/media-mime-support)
	 * [查询字符串的选择](https://evilmartians.com/chronicles/better-web-video-with-av1-codec)
	 *
	 * @return 以逗号隔开的字符串，包含所支持的编码，该值会缓存下来。
	 */
	_supportedCodecs() {
		if (this._codecs) {
			return this._codecs;
		}

		// 顺序跟优先级相同，靠前的编码更先进。
		const codecMap: Array<[string, string]> = [
			["av1", "video/mp4; codecs=av01.0.05M.08"],
			["hevc", "video/mp4; codecs=hvc1"],
		];

		// 只有 iPhone 可能不支持 MediaSource，它可以解码 HEVC。
		if (!("MediaSource" in window)) {
			return "hevc";
		}

		// 另外也可以用 navigator.mediaCapabilities，不过参数略复杂。
		return this._codecs = codecMap
			.filter(c => MediaSource.isTypeSupported(c[1]))
			.map(c => c[0]).join(",");
	},

	IMG(element: HTMLImageElement) {
		if (element.dataset.src) {
			element.src = element.dataset.src;
			delete element.dataset.src;
		}
	},

	/**
	 *
	 *
	 * @param target
	 * @param isInView
	 */
	VIDEO(target: HTMLVideoElement, isInView: boolean) {
		if (target.dataset.src) {
			const url = new URL(target.dataset.src, location.href);
			delete target.dataset.src;

			url.searchParams.set("codecs", this._supportedCodecs(target));
			target.src = url.toString();
		}

		/*
		 * play 返回 Promise 来加等待加载完成，如果元数据还未加载完就暂停会抛出异常。
		 * 这个异常在 Chrome 里是 AbortError，Firefox 是 DomException，无法很好地跟其他情况区分。
		 *
		 * 但元数据的加载被中断是正常的，不影响下次播放，故直接屏蔽掉。
		 *
		 * https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
		 */
		if (target.classList.contains("gif")) {
			isInView ? silencePromise(target.play()) : target.pause();
		}
	},
};

/**
 * 对指定容器元素内的媒体启用懒加载，该函数只能在浏览器端调用。
 *
 * 【Reader View 兼容性】
 * JS 实现的懒加载在浏览器的阅读视图里无法工作，唯一的方案是用 loading="lazy"，
 * 但该属性兼容性还不行。
 * 故不建议使用阅读视图浏览本站的文章，本站的页面已经足够简洁。
 *
 * @param el 容器元素
 * @return 取消监听的函数，在被监视的元素移除后调用，以避免内存泄漏。
 */
export function lazyLoad(el: HTMLElement) {
	const observer = new IntersectionObserver(entries => {
		for (const entry of entries) {
			const { target, intersectionRatio } = entry;
			const isInView = intersectionRatio > 0;
			lazyHandlers[target.tagName](target, isInView);
		}
	});
	for (const e of el.querySelectorAll("img, video")) {
		observer.observe(e);
	}
	return observer.disconnect.bind(observer);
}

/**
 * MarkdownIt 的插件，使用方式：markdownIt.use(clientMediaPlugin)
 *
 * @param markdownIt 要安装的实例
 */
export function clientMediaPlugin(markdownIt: MarkdownIt) {
	markdownIt.use(Media, directiveMap);
	markdownIt.renderer.rules.image = renderImage;
}
