<template functional>
	<figure :class="$style.figure">
		<img
			:src="props.picture"
			alt="封面"
			:class="$style.image"
		>
		<figcaption :class="$style.content">
			<h2>{{props.name}}</h2>
			<span class="loose">{{props.description}}</span>
		</figcaption>
	</figure>
</template>

<style module lang="less">
@import "../../css/Imports";

.figure {
	margin: 0;

	border-radius: 8px;
	box-shadow: 0 2px 3px rgba(10, 10, 10, .1),
	0 0 0 1px rgba(10, 10, 10, .1);
	font-size: 16px;
	overflow: hidden;

	@media screen and (min-width: @length-screen-mobile) {
		width: 320px;
		height: 480px;
	}
}

.image {
	width: 100%;
	height: 250px;

	@media screen and (max-width: @length-screen-mobile) {
		height: 65vw;
	}
}

.content {
	padding: 20px;
}
</style>
