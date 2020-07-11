import "katex/dist/katex.css";
import "./markdown.less";
import MarkdownIt from "markdown-it";
import Anchor from "markdown-it-anchor";
import tableOfContent from "markdown-it-toc-done-right";
import katex from "@iktakahiro/markdown-it-katex";
import media from "@kaciras-blog/server/lib/markdown-media";
import lozad from "lozad";
import highlight from "./highlight";

export const renderer = new MarkdownIt({
	highlight: function (str, lang) {
		let result;
		if (lang && highlight.getLanguage(lang)) {
			result = highlight.highlight(lang, str).value;
		} else {
			result = renderer.utils.escapeHtml(str);
		}
		return "<pre class='hljs'><code>" + result + "</code></pre>";
	},
});

// 【Vue-Router 兼容性】
// 由 Markdown 渲染的标题链接会触发 Vue-Router 的路由流程，需要在路由钩子里做检查以跳过预载，
// 具体见 entry-client.js 中的 router.beforeEach 钩子。
renderer.use(Anchor, {
	permalink: true,
	permalinkClass: "fas fa-link header-anchor",
	permalinkSymbol: "",

	// 参考 MSDN 网站的做法，有 aria-labelledby 情况下不再需要内容
	permalinkAttrs: (slug) => ({ "aria-labelledby": slug }),
});
renderer.use(tableOfContent);
renderer.use(katex);

function getResourceSize(url) {
	const urlParams = new URLSearchParams(url.split("?")[1]);
	const width = parseFloat(urlParams.get("vw"));
	const height = parseFloat(urlParams.get("vh"));
	return width && height ? { width, height } : null;
}

// 使用URL里的宽高参数避免内容加载后布局移动，下面图片的渲染也是。
// 原理讲解：
// https://blog.kaciras.com/article/15/preventing-content-reflow-from-lazy-loaded-images-by-pure-css
renderer.use(media, {
	gif(href, alt) {
		const size = getResourceSize(href);

		let sized = "";
		let style = "";

		if (size) {
			const { width, height } = size;
			const ratio = height / width * 100;
			sized = "sized";
			style = `--width:${width}px; --aspect-ratio:${ratio}%`;
		}

		return `
			<div class="center-wrapper md-media">
				<div class="md-loading-stack ${sized}" style="${style}">
					<video class="md-img gif" src="${href}" loop muted></video>
				</div>
				${alt ? `<span class="md-img-alt">${alt}</span>` : ""}
    		</div>
		`;
	},
	video(src, poster, md) {
		poster = md.normalizeLink(poster);
		if (!md.validateLink(poster)) {
			poster = "";
		}
		return `
			<p class="md-video-container md-loading-stack sized">
				<video poster="${poster}" src="${src}" controls></video>
			</p>
		`;
	},
	audio(src) {
		return `<p class="center-wrapper"><audio controls src=${src}></audio></p>`;
	},
});

/**
 * 给行内代码加个 inline-code 类以便跟代码块区别开
 */
renderer.core.ruler.push("inline_code_class", state => state.tokens
	.filter(token => token.type === "inline")
	.forEach(token => token.children
		.filter(child => child.type === "code_inline")
		.forEach(child => child.attrs = [["class", "inline-code"]])));

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
renderer.renderer.rules.image = (tokens, idx) => {
	const token = tokens[idx];
	const src = token.attrGet("src");
	const alt = token.content;

	const size = getResourceSize(src);

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
				class="md-loading-stack ${sized}"
				style="${style}"
				href="${src}"
				target="_blank"
			>
				<img data-src="${src}" alt="${alt}" class="md-img">
				${placeholder ? LOADING_EL : ""}
			</a>
			${alt ? `<span class="md-img-alt">${alt}</span>` : ""}
    	</span>
	`;
};

/**
 * 将 Markdown 渲染为 HTML.
 *
 * @param markdown Markdown文本
 * @return {string} HTML文本
 */
export function renderMarkdown(markdown) {
	return renderer.render(markdown);
}

/**
 * 对指定容器元素内的媒体启用懒加载，该函数只能在浏览器端调用。
 *
 * 【Reader View 兼容性】
 * 自己实现的懒加载在浏览器的阅读视图里无法工作，唯一的方案是用 loading="lazy"，
 * 但该属性兼容性还不行。
 * 故不建议使用阅读视图浏览本站的文章，本站的文章页面已经足够简洁。
 *
 * @param el 容器元素
 * @return 取消监听的函数，应当在被监视的内容被删除后调用，以避免内存泄漏。
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

			img.removeAttribute("data-src");
		};
	}

	const lozadImages = lozad(images);
	lozadImages.observe();

	const autoPlay = new IntersectionObserver(entries => {
		for (const { target, intersectionRatio } of entries) {
			intersectionRatio > 0 ? target.play() : target.pause();
		}
	});

	el.querySelectorAll(".gif").forEach(video => autoPlay.observe(video));

	return function disconnect() {
		autoPlay.disconnect();
		lozadImages.observer.disconnect();
	};
}
