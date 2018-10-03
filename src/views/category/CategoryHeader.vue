<template>
	<header :class="$style.container">
		<img :src="value.cover" :class="$style.head">

		<div :class="$style.name">
			<h2>{{value.name}}</h2>
		</div>

		<div :class="$style.children">
			<category-card
				v-for="ch of value.children"
				:key="ch.id"
				:name="ch.name"
				:cover="ch.cover"/>
		</div>
	</header>
</template>

<script>
import CategoryCard from "../../components/CategoryCard";

export default {
	name: "CategoryHeader",
	components: { CategoryCard },
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style module lang="less">
@import "../../css/ToBeImport.less";

.container {
	margin-top: -8rem;

	display: grid;
	grid-template-rows: 4rem 4rem auto;
	grid-template-columns: 12% 8rem 1fr;
	grid-template-areas: "____ head name"
						 "meta head desc"
						 "parent children children";
}

.head {
	grid-area: head;
	.circle(8rem);
	background-color: white;
	border: solid 2px white;
	z-index: 4;
}

.name {
	grid-area: name;
	justify-self: start;
	position: relative;
	margin-left: -4rem;
	padding: .5rem .5rem .5rem 4rem;

	color: white;
	background-color: rgba(0, 0, 0, 0.43);

	&::after {
		content: "";
		display: block;
		position: absolute;
		left: 100%;
		top: 0;
		bottom: 0;
		width: 3rem;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.43), transparent);
	}
}

.children {
	grid-area: children;
	display: flex;
	overflow-x: auto;
}
</style>
