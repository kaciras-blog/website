<template functional>
	<div v-bind="data.attrs"
		 :class="[data.class, data.staticClass]"
		 :style="[data.style, data.staticStyle]"
		 v-on="listeners">

		<top-nav/>
		<div v-if="props.showBanner" class="banner" role="banner"></div>
		<main :id="props.viewId">
			<slot/>
		</main>
		<page-footer v-if="props.footer"/>
	</div>
</template>

<script>
export default {
	name: "PageLayout",
	props: {

		footer: Boolean,
		viewId: String,
	},
	render (h, ctx) {
		const { props, data } = ctx;
		const elements = [];
		const topNavData = {};

		if (props.showBanner) {
			elements.push(h("div"), { staticClass: "banner", attrs: { role: "banner" } });
			data.style = data.style || {};
			data.style["--background"] = props.banner.image;

			if (props.theme === 1) {
				topNavData.staticClass = "light";
			} else if (props.theme === 2) {
				topNavData.staticClass = "dark";
			}
		}

		elements.unshift(h("top-nav", topNavData));


		const wrapperData = {
			...data,
			"class": [data.class, data.staticClass],
			style: [data.style, data.staticStyle],
		};
		return h("div", wrapperData, elements);
	},
};
</script>
