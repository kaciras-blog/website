<template>
	<a
		:title="name"
		:href="href"
		target="_blank"
		rel="noopener"
		:class="$style.container"
	>
		<img
			:src="icon"
			:alt="name"
			:class="$style.icon"
		>
	</a>
</template>

<script>
export default {
	name: "SocialLink",
	props: ["name", "href", "icon"],
};
</script>

<style module lang="less">
.container {
	display: inline-block;
	margin: 0 8px;
	padding: 10px;

	border-radius: 50%;
	border: solid 4px #eee;

	transition: .3s;

	&:hover, &:focus {
		border-color: white;
		background-color: var(--color);
		box-shadow: 0 0 10px var(--color);
	}
}

.icon {
	display: block;
	width: 32px;
	height: 32px;
}
</style>
