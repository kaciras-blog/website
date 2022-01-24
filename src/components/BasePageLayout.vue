<template>
	<!-- 做个属性穿透这么麻烦 -->
	<main>
		<slot name="nav">
			<top-nav :class="navClass" :style="navStyle"/>
		</slot>

		<slot></slot>

		<page-footer v-if="footer"/>
	</main>
</template>

<script>
export default {
	name: "BasePageLayout",
	props: {
		footer: {
			type: Boolean,
			default: true,
		},
		navClass: {},
		navStyle: {},
	},
};
</script>
