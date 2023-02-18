<template>
	<slot name='nav'>
		<TopNav
			:class='navClass'
			:style='navStyle'
		/>
	</slot>

	<slot></slot>

	<PageFooter v-if='footer'/>
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
