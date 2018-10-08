<template functional>
	<div v-bind="data.attrs"
		 :class="[data.class, data.staticClass]"
		 :style="[data.style, data.staticStyle]"
		 v-on="listeners">

		<top-nav/>
		<div v-if="props.banner" class="banner" role="banner"></div>
		<main :id="props.viewId">
			<slot/>
		</main>
		<page-footer v-if="props.footer"/>
	</div>
</template>

<script>
export default {
	props: ["footer", "viewId", "banner"],
	name: "PageLayout",
};
</script>
