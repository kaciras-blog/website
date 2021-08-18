<!--<template functional>-->
<!--	<span :class="[$style.authTag, $style[AuthType[props.authType]]]" title="">{{ props.authType }}</span>-->
<!--</template>-->

<script>
import { AuthType } from "@/api";

export default {

	render(h, context) {
		const name = AuthType[context.props.authType];
		const { $style } = context;
		const data = {
			attrs: { title: "登录类型" },
			class: [$style.authTag, $style[name]],
		};
		return h("span", data, name);
	},
}
</script>

<style module lang="less">
.authTag {
	padding: 1px 4px;
	border-radius: 4px;
	color: white;

	&::selection {
		background: none;
	}
}

.Local {
	background-color: #ef8660;
}

.Github {
	background-color: #63b1e2;
}

.Google {
	background-color: #85dead;
}
</style>
