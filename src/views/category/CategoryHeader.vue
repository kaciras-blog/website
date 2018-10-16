<template>
	<header :class="$style.container">
		<img :src="value.cover" :class="$style.head">
		<h1 :class="$style.name">{{value.name}}</h1>
		<h3 :class="$style.desc">{{value.description}}</h3>

		<div :class="$style.parent">
			<h3 class="segment">上级分类</h3>
			<div></div>
		</div>

		<div :class="$style.children">
			<h3 class="segment">下级分类</h3>
			<div>
				<category-card
					v-for="ch of value.children"
					:key="ch.id"
					v-bind="ch"
					@click="goto(ch.id)"/>
			</div>
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
	grid-gap: 1rem;
	grid-template-areas: "____ head name" "meta head desc" "parent __ children";

	border-top: solid 6px #16a9fa;
}

.head {
	grid-area: head;
	margin-top: -4rem;
	z-index: 4;
	.size(10rem, 10rem);
	border-radius: 1rem;

	background-color: white;
	border: solid 6px #16a9fa;
}

.name {
	grid-area: name;
	position: relative;
	padding: 1rem 1rem 1rem 0;

	/*background-color: rgba(0, 0, 0, 0.6);*/
}

.desc {
	grid-area: desc;
}

.parent {
	grid-area: parent;
}

.children {
	grid-area: children;
	overflow-x: auto;
}
</style>
