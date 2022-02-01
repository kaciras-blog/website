/*
 * 目前仅用来注入些 SEO 相关的信息，即便留到其它的页面也不会影响用户体验。
 */
import { onBeforeMount, useSSRContext } from "vue";

interface HeadMetaObject {
	meta?: string;
	title?: string;
}

function useSSRHeadMeta() {
	return useSSRContext<HeadMetaObject>()!;
}

// meta 对于客户端无意义，就不管它了。
function useClientHeadMeta() {
	const object: HeadMetaObject = {};
	onBeforeMount(() => {
		if (object.title) {
			document.title = object.title + " - Kaciras 的博客";
		}
	});
	return object;
}

export default import.meta.env.SSR
	? useSSRHeadMeta : useClientHeadMeta;
