<template functional>
	<p :class="$style.wrapper">
		<img
			:class="$style.image"
			:src="props.src"
			:alt="props.title"
			:title="props.title"
		>
		<span :class="$style.text"><slot/></span>
	</p>
</template>

<script>
export default {
	name: "IconParagraph",
};
</script>

<style module lang="less">
.wrapper {
	display: flex;
	align-items: self-start;
}

.image {
	margin-right: 8px;
	width: 2.5em;
	height: 2.5em;
}

.text {
	padding-top: .5em;
}
</style>
