<template functional>
	<main id="error-page">
		<h1 class="err-title">{{props.title}}</h1>
		<img class="err-img" :src="props.image" alt="ErrorImage">
		<div class="err-content"><slot/></div>
	</main>
</template>

<script>
export default {
	name: "ErrorContent",
	props: {
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default: "/static/img/error-other.png",
		},
	},
};
</script>

<style scoped lang="less">
@import "../../css/Imports";

.err-title {
	color: #2f91ff;
	grid-area: title;
	text-align: center;
}

.err-img {
	grid-area: image;
	.size(16rem);

	@media screen and (min-width: @length-screen-mobile) {
		.full-percent;
	}
}

.err-content {
	grid-area: content;
	text-align: center;
}

#error-page {
	font-size: 1.1rem;
	margin: 1rem;

	display: grid;
	justify-content: center;
	grid-row-gap: 1rem;
	grid-template-rows: auto auto auto;
	grid-template-areas: "title" "image" "content";

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-rows: auto 10rem;
		grid-template-columns: 11rem auto;
		grid-column-gap: 2rem;
		grid-template-areas: "title title" "image content";
	}
}
</style>
