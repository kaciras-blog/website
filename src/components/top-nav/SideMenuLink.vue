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
		direct: {
			type: Boolean,
			default: false,
		},
		to: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
	},
	render(h, ctx) {
		const { direct, to, icon } = ctx.props;

		const innerElements = [
			h("i", { class: [ctx.$style.icon, icon] }),
			ctx.slots().default,
		];

		if (direct) {
			return h("a", {
				attrs: { href: to },
				staticClass: "clean-link",
				class: ctx.$style.link,
			}, innerElements);
		} else {
			return h("router-link", {
				attrs: { to },
				staticClass: "clean-link",
				class: ctx.$style.link,
			}, innerElements);
		}
	},
};
</script>

<style module lang="less">
.link {
	display: block;
	padding: 12px 0;

	&:hover, &:focus {
		background-color: rgba(0, 0, 0, .05);
	}
}

.icon {
	margin: 0 1pc;
}
</style>
