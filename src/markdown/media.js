import lozad from "lozad";
import media from "@kaciras-blog/server/lib/markdown-media";

/**
 * 从资源的链接参数（?vw=...&vh=...）里读取媒体的尺寸。
 *
 * @param url 资源的链接
 * @return { width, height } 媒体的尺寸
 */
function getMediaResolution(url) {
	const urlParams = new URLSearchParams(url.split("?")[1]);
	const width = parseFloat(urlParams.get("vw"));
	const height = parseFloat(urlParams.get("vh"));
	return width && height ? { width, height } : null;
}

/**
 * 各种自定义指令在本站页面的渲染实现。
 *
 * https://blog.kaciras.com/article/18/add-video-support-to-markdown
 */
const directiveMap = {
	gif(src, alt) {
		const size = getMediaResolution(src);

		let sized = "";
		let style = "";

		if (size) {
			const { width, height } = size;
			const ratio = height / width * 100;
			sized = "sized";
			style = `--width:${width}px; --aspect-ratio:${ratio}%`;
		}

		// 大部分浏览器只允许无声视频自动播放，不过GIF视频本来就是无声的。
		return `
			<p class="center-wrapper">
				<span class="md-media-container ${sized}" style="${style}">
					<video class="md-img gif" src="${src}" loop muted></video>
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
			<p class="md-video-container md-media-container sized">
				<video poster="${poster}" src="${src}" controls></video>
			</p>
		`;
	},
	audio(src) {
		return `<p class="center-wrapper"><audio controls src=${src}></audio></p>`;
	},
};

/** 加载指示器动画元素，五个彩色的点比菊花还是好看些的 */
const LOADING_EL = `
<span class="full-vertex md-loading">
	<span class="dot"></span>
	<span class="dot"></span>
	<span class="dot"></span>
	<span class="dot"></span>
	<span class="dot"></span>
</span>`;

/**
 * 自定义图片的渲染，具有加载指示器。
 *
 * 当图片的URL里带有 vw & vh 时设定加载指示器的尺寸与图片相同，以避免图片载入后的布局改变。
 *
 * 【边界情况】
 * 1）没有尺寸信息：使用一个默认尺寸
 * 2）图片过小：不添加加载指示器
 */
function renderImage(tokens, idx) {
	const token = tokens[idx];
	const src = token.attrGet("src");
	const alt = token.content;

	const size = getMediaResolution(src);

	let sized = "";
	let style = "";
	let placeholder = true;

	if (size) {
		const { width, height } = size;

		// 如果图片过小容不下加载指示器，就不添加它
		if (width < 200 || height < 50) {
			placeholder = false;
		}

		const ratio = height / width * 100;
		sized = "sized";
		style = `--width:${width}px; --aspect-ratio:${ratio}%`;
	}

	return `
		<span class="center-wrapper">
			<a
				class="md-media-container ${sized}"
				style="${style}"
				href="${src}"
				rel="nofollow"
				target="_blank"
			>
				<img data-src="${src}" alt="${alt}" class="md-img">
				${placeholder ? LOADING_EL : ""}
			</a>
			${alt ? `<span class="md-img-alt">${alt}</span>` : ""}
    	</span>
	`;
}

/**
 * MarkdownIt 的插件，使用方式：markdownIt.use(clientMediaPlugin)
 *
 * @param markdownIt 要安装的实例
 */
export function clientMediaPlugin(markdownIt) {
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
 * @return 取消监听的函数，应当在被监视的元素移除后调用，以避免内存泄漏。
 */
export function initLazyLoading(el) {
	const images = el.querySelectorAll("img");

	for (const img of images) {
		img.onerror = img.onload = () => {

			/*
			 * TODO: Webpack4 使用的 acorn6.x 不支持 OptionalChaining，
			 *  且服务端构建未使用 Babel 导致会报错
			 *
			 * 而且 Webpack4 不准备升级 acorn 7.x：
			 * https://stackoverflow.com/a/59972726
			 */
			const placeholder = img.nextElementSibling;
			if (placeholder) {
				placeholder.remove();
			}
			// img.nextElementSibling?.remove();

			img.removeAttribute("data-src");
		};
	}

	const lozadImages = lozad(images);
	lozadImages.observe();

	// gif 视频自动播放/暂停
	const autoPlay = new IntersectionObserver(entries => {
		for (const { target, intersectionRatio } of entries) {
			const { _controller } = target;
			intersectionRatio > 0 ? _controller.play() : _controller.pause();
		}
	});

	el.querySelectorAll(".gif").forEach(video => {
		autoPlay.observe(video);
		video._controller = new VideoController(video);
	});

	return function disconnect() {
		autoPlay.disconnect();
		lozadImages.observer.disconnect();
	};
}

/*
 * 下面是临时修复测试代码，先上线看看有没有问题。
 *
 * https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
 */
const UNLOAD = 0;
const LOADING = 1;
const LOADED = 2;

class VideoController {

	constructor(video) {
		this.video = video;
		this.state = UNLOAD;
	}

	play() {
		const { video, state } = this;
		switch (state) {
			case UNLOAD:
				this.state = LOADING;
				video.play().then(() => this.postInit());
				break;
			case LOADING:
				this.paused = false;
				break;
			case LOADED:
				video.play();
				break;
		}
	}

	pause() {
		const { video, state } = this;
		if (state === LOADING) {
			this.paused = true;
		} else if (state === LOADED) {
			video.pause();
		}
	}

	postInit() {
		if (this.paused) {
			this.video.pause();
		}
		this.state = LOADED;
	}
}
