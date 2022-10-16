import type { SSRContext } from "vue/server-renderer";
import { defineComponent, h, nextTick, onUnmounted, SetupContext, Teleport } from "vue";
import { defineStore } from "pinia";

/**
 * 首次渲染的状态，使用 nextTick 来递进该值实现推迟渲染。
 * 没有很好的方法探测是否处于混合状态，只能规避首次渲染了。
 */
enum HydrationState {
	Before,
	Running,
	Finished,
}

const useHeadMetas = defineStore("HeadMetas", {
	state: () => ({
		inherited: false,					// 是否存在非 base 的组件。
		hydration: HydrationState.Before,	// 客户端混合的阶段。
	}),
});

type Store = ReturnType<typeof useHeadMetas>;

/**
 * 这里的实现参考了 react-head 的思路，SSR 出来的标签打上一个标记，
 * CSR 时将这些元素全部移除，然后重新使用 Teleport 渲染一遍。
 *
 * 虽然这样在删除和插入之间有一个不一致状态，但 DOM 的变化本身就是异步的，
 * 需要访问这些标签的代码不应该依赖强一致。
 *
 * 另外为了减少 DOM 操作，首次渲染将延迟到下一个 Track。
 *
 * @see https://github.com/tizmagik/react-head
 */
function HeadMetaWeb(this: SetupContext, info: Store, isBase: boolean) {
	if (info.hydration === HydrationState.Before) {
		info.hydration = HydrationState.Running;

		nextTick().then(() => {
			document.head
				.querySelectorAll("[data-ht]")
				.forEach(i => i.remove());

			info.hydration = HydrationState.Finished;
		});
	}

	if (isBase) {
		if (info.inherited) {
			return null;
		}
	} else {
		info.inherited = true;
	}

	if (info.hydration !== HydrationState.Finished) {
		return null;
	}
	return h(Teleport, { to: "head" }, this.slots);
}

/**
 * 服务端没什么好说的，这里复用了 Teleport 比自己调用 renderToString 简单些，
 * 不过这样一来实现覆盖需要额外处理一下。
 */
function HeadMetaSSR(this: SetupContext, info: Store, isBase: boolean) {
	const to = isBase ? "headTagsBase" : "headTags";
	if (!isBase) {
		info.inherited = true;
	}
	const vnodes = this.slots.default!();
	for (const { props } of vnodes) {
		props && (props["data-ht"] = "");
	}
	return h(Teleport, { to }, { default: () => vnodes });
}

/**
 * SSR 渲染时调用这个函数，获取需要插入 <head> 内的 HTML，末尾的 Teleport 标记已移除。
 *
 * @param ctx SSR 上下文
 */
export function getHeadTagsSSR(ctx: SSRContext) {
	const { headTags, headTagsBase } = ctx.teleports!;
	return (headTags ?? headTagsBase ?? "").slice(0, -22);
}

/**
 * 为了 SEO，使用该组件可以在页面的 <head> 中加入一些标签，与 Teleport 相比有些区别：
 * 1）如果修改过目标的子元素，则 Teleport 会混合失败，React 似乎没这个问题。
 * 2）需要支持一个默认值，避免每个页面都写一堆，而 Teleport 相同的目标不覆盖。
 *
 * @see https://github.com/vuejs/core/issues/5242
 */
export default defineComponent({
	props: {
		base: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, ctx) {
		const info = useHeadMetas();

		onUnmounted(() => {
			if (!props.base) info.inherited = false;
		});

		if (import.meta.env.SSR) {
			return HeadMetaSSR.bind(ctx, info, props.base);
		} else {
			return HeadMetaWeb.bind(ctx, info, props.base);
		}
	},
});
