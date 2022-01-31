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
import { h } from "vue";

export default {
	name: "SideMenuLink",
	props: {
		tag: {
			type: String,
			default: "router-link",
		},
		to: {
			type: String,
			required: false,
		},
	},
	render() {
		const { $style, tag, to } = this;
		// const { , listeners } = ctx;

		let data;

		switch (tag) {
			case "router-link":
				data = { to, class: ["clean-link", $style.link] };
				break;
			case "div":
				data = { class: $style.link };
				break;
			case "a":
				data = { href: to,  class: ["clean-link", $style.link] };
				break;
		}

		return h(tag, data, this.$slots.default());
	},
};
</script>

<style module lang="less">
.link {
	display: block;
	padding: 10px 0;

	& > svg {
		font-size: 24px;
		vertical-align: -6px;
		margin: 0 1pc;
	}

	&:hover, &:focus {
		background-color: rgba(0, 0, 0, .05);
	}
}
</style>
