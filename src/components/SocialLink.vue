<template functional>
	<a
		:title="props.name"
		:href="props.href"
		target="_blank"
		:class="$style.container"
	>
		<img
			:src="props.icon"
			:alt="props.name"
			:class="$style.icon"
		>
	</a>
</template>

<script>
export default {
	name: "SocialLink",
};
</script>

<style module lang="less">
.container {
	display: inline-block;
	margin: 0 10px;
	padding: 10px;

	border-radius: 50%;
	border: solid 4px #f0f0f0;

	transition: .3s;

	&:hover, &:focus {
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
