<template>
	<section id="family">
		<div :class="$style.parent">
			<h3 class="segment">上级分类</h3>
			<category-card
				v-bind="parent"
				@click="goto(parent.id)"/>
		</div>

		<div :class="$style.children">
			<h3 class="segment">下级分类</h3>
			<div>
				<category-card
					v-for="ch of children"
					:key="ch.id"
					v-bind="ch"
					@click="goto(ch.id)"/>
			</div>
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

		},
	},
};
</script>

<style module lang="less">
:global(#family) {

}

.parent {
	display: inline-block;
}

.children {
	display: inline-block;
	overflow-x: auto;
}
</style>
