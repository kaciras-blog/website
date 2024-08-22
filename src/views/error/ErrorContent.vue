<template>
	<main :class='$style.container'>
		<h1 :class='$style.title'>{{ title }}</h1>
		<img
			:src='image'
			alt='ErrorImage'
			:class='$style.image'
		>
		<div :class='$style.content'><slot/></div>
	</main>
</template>

<script setup lang="ts">
interface ErrorContentProps {
	title: string;
	image: string;
}

defineProps<ErrorContentProps>();
</script>

<style module lang="less">
@import "../../css/imports.less";

.container {
	display: grid;
	grid-template-rows: auto auto auto;
	grid-template-areas: "title" "image" "content";
	gap: 2rem;
	place-content: center;

	margin-bottom: 2rem; /* 整体往上移点。 */
	flex: 1;
	font-size: 16px;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-rows: auto 10rem;
		grid-template-columns: 11rem auto;
		grid-template-areas: "title title" "image content";
	}
}

.title {
	composes: compact from global;

	grid-area: title;
	font-size: 2.5rem;
	color: #2f91ff;
	text-align: center;
}

.image {
	grid-area: image;
	.size(16rem);
	justify-self: center;

	@media screen and (min-width: @length-screen-mobile) {
		.size(100%);
	}
}

.content {
	grid-area: content;
	text-align: center;

	@media screen and (max-width: @length-screen-mobile) {
		padding: 20px 0;
	}
}
</style>
