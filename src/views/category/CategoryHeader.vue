<template>
	<header :class="$style.container">
		<img :src="value.cover" :class="$style.head">
		<h1 :class="$style.name">{{value.name}}</h1>
		<span :class="$style.desc">{{value.description}}</span>
	</header>
</template>

<script>
export default {
	name: "CategoryHeader",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports.less";

.container {
	margin-top: -4rem;

	display: grid;
	grid-template-rows: 4rem 4rem;
	grid-template-columns: 15% 10rem 1fr;
	grid-gap: 1rem;
	grid-template-areas: "____ head name" "meta head desc";

	border-top: solid 6px white;
}

.head {
	grid-area: head;
	margin-top: -3rem;
	z-index: 4;
	.size(10rem);
	border-radius: 1rem;

	background-color: white;
	border: solid 4px white;
}

.name {
	grid-area: name;
	position: relative;
	padding: 1rem 1rem 1rem 0;
}

.desc {
	grid-area: desc;
	font-size: 1.1em;
}
</style>
