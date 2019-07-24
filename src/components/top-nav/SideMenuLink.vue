<!-- 左边弹出菜单里的带图标链接 -->
<template functional>
	<router-link
		class="clean-link"
		:class="$style.link"
		:to="props.to"
	>
		<i :class="[$style.icon, props.icon]"></i>
		<slot/>
	</router-link>
</template>

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
