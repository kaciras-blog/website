import type { SSRContext } from "vue/server-renderer";
import { defineComponent, useSSRContext } from "vue";

export interface PageMetaProps {

	/**
	 * 如果存在，则修改页面的标题。
	 */
	title?: string;

	/**
	 * 如果存在，则设为 body 元素的 class。
	 */
	bodyClass?: string;
}

function renderServer(this: PageMetaProps, context: SSRContext) {
	const { title, bodyClass } = this;
	context.bodyClass = bodyClass;
	if (title) {
		context.title = title + " - Kaciras Blog";
	}
}

function renderClient(this: PageMetaProps) {
	const { title, bodyClass } = this;
	if (bodyClass !== undefined) {
		document.body.className = bodyClass;
	}
	if (title) {
		document.title = title + " - Kaciras Blog";
	}
}

/**
 * 修改一些全局 DOM 节点的组件，包括标题，body 的 class 等。
 *
 * 这是个非渲染组件，不影响 DOM，可以看做是 title 和一些属性的 teleport。
 * 虽然放在任意位置的效果都一样，但推荐放在组件的开头。
 *
 * 注意该组件没有卸载机制，当页面切换时新的页必须也使用该组件来覆盖，
 * 否则上一次的值仍留着。
 *
 * 当然也可以在一个页面中多次使用本组件，各自修改不同的属性。
 *
 * <h2>为什么用组件</h2>
 * 从语义上看，标题和全局元素的 class 也属于 DOM 的一部分，用模板是合适的。
 * 而且比起在 JS 里用各种钩子，模板渲染也正好是修改它们的时机。
 *
 * 这个类的灵感来自于 Next.js 的 Head 组件。
 *
 * @see https://nextjs.org/docs/api-reference/next/head
 */
export default defineComponent({
	props: {
		title: {
			type: String,
			required: false,
		},
		bodyClass: {
			type: String,
			required: false,
		},
	},
	setup(props) {
		if (import.meta.env.SSR) {
			const ssr = useSSRContext()!;
			return renderServer.bind(props, ssr);
		} else {
			return renderClient.bind(props);
		}
	},
});
