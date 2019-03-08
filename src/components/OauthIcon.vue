<template>
	<a :href="href">
		<img
			:class="$style.oauthLogo"
			:src="image"
			:alt="tip"
			:title="tip">
	</a>
</template>

<script>
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
	computed: {
		href () {
			return `https://localhost:2375/connect/${this.endpoint}?ret=${this.returnUri}`;
		},
		image () {
			return `/static/icons/${this.icon}`;
		},
	},
};
</script>

<style module lang="less">
.oauthLogo {
	width: 48px;
	height: 48px;
}
</style>
