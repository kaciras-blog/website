<template>
	<header :class="$style.container">
		<img :src="value.cover" :class="$style.head">
		<h1 :class="$style.name">{{value.name}}</h1>
		<h3 :class="$style.desc">{{value.description}}</h3>

		<div :class="$style.children">
			<category-card
				v-for="ch of value.children"
				:key="ch.id"
				v-bind="ch"
				@click="goto(ch.id)"/>
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
	methods: {
		goto(category) {

		},
	},
};
</script>

<style module lang="less">
@import "../../css/ToBeImport.less";

.container {
	margin-top: -4rem;

	display: grid;
	grid-template-rows: 4rem 4rem auto;
	grid-template-columns: 15% 10rem 1fr;
	grid-template-areas: "____ head name"
						 "meta head desc"
						 "parent children children";

	/*background-color: #81d9fa;*/
}

.head {
	grid-area: head;
	margin-top: -4rem;
	.circle(10rem);
	background-color: white;
	border: solid 8px white;
	z-index: 4;
}

.name {
	grid-area: name;
	position: relative;
	padding: 1rem 1rem 1rem 1rem;

	/*background-color: rgba(0, 0, 0, 0.6);*/
}

.desc{
	grid-area: desc;
}

.children {
	grid-area: children;
	display: flex;
	overflow-x: auto;
}
</style>
