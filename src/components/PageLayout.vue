<template functional>
	<div v-bind="data.attrs"
		 :class="[data.class, data.staticClass]"
		 :style="[data.style, data.staticStyle]"
		 v-on="listeners">

		<top-nav :banner="props.banner"
				 :show-banner="props.showBanner"
				 :class="props.navClass"
				 :style="props.navStyle"/>

		<main :id="props.viewId">
			<slot/>
		</main>
		<page-footer v-if="props.footer"/>
	</div>
</template>

<script>
export default {
	props: {
		footer: {
			type: Boolean,
			default: true,
		},
		viewId: {},
		showBanner: {},
		banner: {},
		navClass: {},
		navStyle: {},
	},
	name: "PageLayout",
};
</script>
