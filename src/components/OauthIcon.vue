<script>
export default {
	name: "OauthIcon",
	functional: true,
	props: {
		endpoint: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		tip: {
			type: String,
			required: true,
		},
		returnUri: String,
	},
	render(h, ctx) {
		const { endpoint, returnUri, icon, tip } = ctx.props;

		// <img :class="$style.logo" :src="..." :alt="tip" :title="tip">
		const src = require("../assets/img/" + icon);
		const attrs = { src, alt: tip, title: tip };
		const imgElement = h("img", { staticClass: ctx.$style.logo, attrs });

		// <a :href="href"><img ...></a>
		const href = `https://localhost:2375/connect/${endpoint}?ret=${returnUri}`;
		return h("a", { attrs: { href } }, [imgElement]);
	},
};
</script>

<style module lang="less">
.logo {
	width: 40px;
	height: 40px;
	margin: 5px;
}
</style>
