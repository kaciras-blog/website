<template>
	<section :class='$style.container'>
		<h1 :class='$style.title'>{{ title }}</h1>
		<img
			:src='image'
			alt='ErrorImage'
			:class='$style.image'
		>
		<div :class='$style.content'><slot/></div>
	</section>
</template>

<script setup lang="ts">
interface ErrorContentProps {
	title: string;
	image: string;
}

defineProps<ErrorContentProps>();
</script>

<style module lang="less">
@import "../../css/imports";

.title {
	color: #2f91ff;
	grid-area: title;
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

.container {
	display: grid;
	justify-content: center;
	grid-row-gap: 1rem;
	grid-template-rows: auto auto auto;
	grid-template-areas: "title" "image" "content";

	font-size: 16px;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-rows: auto 10rem;
		grid-template-columns: 11rem auto;
		grid-column-gap: 2rem;
		grid-template-areas: "title title" "image content";
	}
}
</style>
