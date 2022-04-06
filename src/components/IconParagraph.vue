<template>
	<p :class="$style.wrapper">
		<img
			:class="$style.image"
			:src="src"
			:alt="title"
			:title="title"
		>
		<span :class="$style.text"><slot/></span>
	</p>
</template>

<script setup lang="ts">
interface IconParagraphProps {
	src: string;
	title: string;
}

defineProps<IconParagraphProps>();
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
