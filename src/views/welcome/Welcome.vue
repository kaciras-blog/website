<template>
	<page-layout view-id="welcome-page">
		<section :class="$style.banner">
			<div :class="$style.overlay"></div>
			<div :class="$style.galss">
				<h1>Kaciras' Blog</h1>
				<p>程序 • 生活 • 梦想</p>
			</div>
		</section>
		<blog-section/>
	</page-layout>
</template>

<script>
import BlogSection from "./BlogSection";

export default {
	name: "Welcome",
	components: { BlogSection },
};
</script>

<style module lang="less">
@import "../../css/Imports";

:global(#welcome-page) {

}

.banner {
	display: flex;
	flex-direction: column;
	justify-content: center;

	position: relative;
	height: 100vh;

	background-image: url("../../assets/img/68079722.jpg");
	background-size: cover;
	background-position: center bottom;
}

.overlay {
	position: absolute;
	.full-vertex;

	@yellow: rgba(255, 255, 0, .12);
	@blue: rgba(0, 155, 255, 0.08);
	@pink: rgba(255, 0, 140, 0.09);

	@white: rgba(255, 255, 255, 0.6);

	@media screen and (min-width: @length-screen-mobile) {
		--gradient-deg: 45deg;
	}

	background-image: linear-gradient(
		var(--gradient-deg, 80deg),
		@yellow 0%, @yellow 24.8%,
		@white 24.8%, @white 25%,

		@blue 25%, @blue 49.8%,
		@white 49.8%, @white 50%,

		transparent 50%, transparent 74.8%,
		@white 74.8%, @white 75%,

		@pink 75%, @pink 100%);
}

.galss {
	text-align: center;
	z-index: 2;

	& > h1 {
		font-size: 5rem;
	}

	& > p {
		font-size: 2rem;
	}
}
</style>

<!--

-->
