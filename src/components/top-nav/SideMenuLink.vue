<!-- 左边弹出菜单里的带图标链接 -->

<!--<template functional>-->
<!--	<router-link-->
<!--		class="clean-link"-->
<!--		:class="$style.link"-->
<!--		:to="props.to"-->
<!--	>-->
<!--		<i :class="[$style.icon, props.icon]"></i>-->
<!--		<slot/>-->
<!--	</router-link>-->
<!--</template>-->

<script>
export default {
	name: "SideMenuLink",
	functional: true,
	props: {
		tag: {
			type: String,
			default: "router-link",
		},
		to: {
			type: String,
			required: false,
		},
		icon: {
			type: String,
			required: true,
		},
	},
	render(h, ctx) {
		const { tag, to, icon } = ctx.props;
		const { $style, listeners } = ctx;

		let data;

		switch (tag) {
			case "router-link":
				data = { attrs: { to }, staticClass: "clean-link", class: $style.link };
				break;
			case "div":
				data = { class: $style.link, on: { click: listeners.click } };
				break;
			case "a":
				data = { attrs: { href: to }, staticClass: "clean-link", class: $style.link };
				break;
		}

		return h(tag, data, [
			h("i", { class: [$style.icon, icon] }),
			ctx.slots().default,
		]);
	},
};
</script>

<style module lang="less">
.link {
	display: block;
	padding: 10px 0;

	&:hover, &:focus {
		background-color: rgba(0, 0, 0, .05);
	}
}

.icon {
	margin: 0 1pc;
}
</style>
