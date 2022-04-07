<template>
	<!-- 做个属性穿透这么麻烦 -->
	<slot name="nav">
		<top-nav
			:class="navClass"
			:style="navStyle"
		/>
	</slot>

	<slot></slot>

	<page-footer v-if="footer"/>
</template>

<script>
import PageFooter from "./PageFooter.vue";
import TopNav from "./top-nav/TopNav.vue";

export default {
	name: "BasePageLayout",
	components: {
		PageFooter,
		TopNav,
	},
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
