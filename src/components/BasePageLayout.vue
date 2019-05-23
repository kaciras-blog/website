<template functional>
	<!-- 做个属性穿透这么麻烦 -->
	<main v-bind="data.attrs"
		  :class="[data.class, data.staticClass]"
		  :style="[data.style, data.staticStyle]"
		  v-on="listeners">

		<slot name="nav">
			<top-nav :class="props.navClass" :style="props.navStyle"/>
		</slot>

		<slot></slot>
		<page-footer v-if="props.footer"/>
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
