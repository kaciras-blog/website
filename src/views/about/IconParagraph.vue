<template functional>
	<p>
		<img :class="$style.image"
			 :src="props.src"
			 :alt="props.title"
			 :title="props.title">
		<slot></slot>
	</p>
</template>

<script>
export default {
	name: "IconParagraph",
};
</script>

<style module lang="less">
.image {
	width: 2.5em;
	height: 2.5em;
}
</style>
