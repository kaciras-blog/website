<template>
	<section class="segment" :class="$style.container">
		<!--<div :class="$style.parent">-->
		<!--<h2>上级分类</h2>-->
		<!--<category-card-->
		<!--v-if="parent"-->
		<!--v-bind="parent"-->
		<!--@click="goto(parent.id)"/>-->

		<!--<span v-else :class="$style.ccard">没有</span>-->
		<!--</div>-->

		<div :class="$style.children">
			<h2 class="compact">下级分类</h2>
			<div v-if="children.length">
				<category-card
					v-for="child of children"
					:key="child.id"
					v-bind="child"
					@click="goto(child)"/>
			</div>
			<div v-else :class="$style.holder">已经是最底层的分类了</div>
		</div>
	</section>
</template>

<script>
import CategoryCard from "../../components/CategoryCard";

export default {
	name: "FamilySection",
	components: { CategoryCard },
	props: {
		parent: Object,
		children: Array,
	},
	methods: {
		goto (category) {
			this.$router.push(`/category/${category.id}/${category.name}`);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.container {
	/*display: flex;*/
	margin: 0 auto 0 auto;
	padding: 0 !important;
	max-width: 90%;
}

.ccard {
	display: block;
	.size(5rem);
}

.parent {
	display: inline-block;
}

.children {
	/*display: inline-block;*/
	overflow-x: auto;
}

.holder {
	color: @color-text-minor;
	padding: 4rem 0;
	text-align: center;
}
</style>
