<template>
	<div class="category-card">
		<img class="head" :src="cover" alt="分类图标">
		<h3 class="compact">{{name}}</h3>
	</div>
</template>

<script>
export default {
	name: "CategoryCard",
	props: {
		cover: String,
		name: String,
	},
};
</script>

<style lang="less">
.category-card {
	margin: 1rem;
	padding: 0 1rem 1rem;
	max-width: 9rem;

	cursor: pointer;

	text-align: center;
	border: solid 1px #f3f3f3;

	& > .head {
		display: block;
		margin: 1rem;
	}

	&:hover {
		border-color: transparent;
		box-shadow: 0 0 4px 3px #97dfff;
	}
}
</style>
