import { defineComponent, h, nextTick, onUnmounted, SetupContext, Teleport } from "vue";
import { defineStore } from "pinia";
import { SSRContext } from "vue/server-renderer";

/*
 * 为了 SEO，需要在预渲染的文章页面的 <head> 中加入一些标签。暂时没法用 teleport 因为有 BUG：
 * https://github.com/vuejs/core/issues/5242
 */

const useHeadMetas = defineStore("HeadMetas", {
	state: () => ({
		hydration: 0,
		inherited: false,
	}),
});

type Store = ReturnType<typeof useHeadMetas>;

function HeadMetaWeb(this: SetupContext, info: Store, isBase: boolean) {
	if (info.hydration === 0) {
		info.hydration = 1;

		nextTick().then(() => {
			info.hydration = 2;
			document.head
				.querySelectorAll("[data-ht]")
				.forEach(i => i.remove());
		});
	}

	if (isBase) {
		if (info.inherited) {
			return null;
		}
	} else {
		info.inherited = true;
	}

	if (info.hydration !== 2) {
		return null;
	}
	return h(Teleport, { to: "head" }, this.slots);
}

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

export function getHeadTagsSSR(ctx: SSRContext) {
	const { headTags, headTagsBase } = ctx.teleports!;
	return (headTags ?? headTagsBase ?? "").slice(0, -22);
}

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
