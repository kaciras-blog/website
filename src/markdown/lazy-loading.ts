import { silencePromise } from "@kaciras/utilities/browser";

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

	IMG(element: HTMLImageElement, isInView: boolean) {
		if (isInView && element.dataset.src) {
			element.src = element.dataset.src;
			delete element.dataset.src;
		}
	},

	VIDEO(target: HTMLVideoElement, isInView: boolean) {
		if (target.dataset.src) {
			const url = new URL(target.dataset.src, location.href);
			delete target.dataset.src;

			url.searchParams.set("codecs", this._supportedCodecs(target));
			target.src = url.toString();
		}

		/*
		 * play() 返回 Promise 来加等待加载完成，如果元数据还未加载完就暂停会抛出异常。
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
 * JS 实现的懒加载在浏览器的阅读视图里无法工作，唯一的方案是用 loading="lazy"，但兼容性还不行。
 * 故不建议使用阅读视图浏览本站的文章，本站的页面已经足够简洁。
 *
 * @param root 容器元素
 * @return 取消监听的函数，在被监视的元素移除后调用，以避免内存泄漏。
 */
export function observeLazyLoad(root: HTMLElement) {
	const observer = new IntersectionObserver(entries => {
		for (const entry of entries) {
			const { target, isIntersecting } = entry;
			lazyHandlers[target.tagName](target, isIntersecting);
		}
	});
	for (const e of root.querySelectorAll("img, video")) {
		observer.observe(e);
	}
	return observer.disconnect.bind(observer);
}
