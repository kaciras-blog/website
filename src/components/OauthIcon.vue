<script lang='ts'>
import { h } from "vue";
import { contentServiceURL } from "@/api/constants.ts";

export default {
	name: "OauthIcon",
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
	render() {
		const { endpoint, returnUri, icon, tip, $style } = this;

		// <img :class="$style.logo" :src="..." :alt="tip" :title="tip">
		const imgElement = h("img", {
			title: tip,
			src: icon,
			alt: tip,
			class: $style.logo,
		});

		// <a :href="href"><img ...></a>
		const href = `${contentServiceURL}/oauth2/connect/${endpoint}?ret=${returnUri}`;
		return h("a", { href }, [imgElement]);
	},
};
</script>

<style module lang="less">
.logo {
	width: 40px;
	height: 40px;
	margin: 0 10px;
}
</style>
