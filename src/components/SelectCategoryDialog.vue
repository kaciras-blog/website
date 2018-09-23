<template>
	<kx-dialog class="category-selector" :draggable="true">
		<h3 slot="title">选择分类</h3>
		<div class="cards">
			<div v-for="cate of categories" :key="cate.id">
				<category-card v-bind="cate"/>
				<kx-check-box/>
			</div>
		</div>
		<div slot="footer" class="buttons">
			<button>确定</button>
		</div>
	</kx-dialog>
</template>

<script>
import CategoryCard from "./CategoryCard";
import api from "../apis";

export default {
	name: "SelectCategoryDialog",
	components: { CategoryCard },
	props: {
		multiple: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		selected: [],
		categories: [],
	}),
	methods: {

	},
	created() {
		api.category.getChildren(0).then(res => this.categories = res);
	},
};
</script>

<style scoped lang="less">
.category-selector {

	& .kx-dialog-body {
		padding: 0;
	}
}
.cards {
	width: 50vmax;
	height: 50vmin;

	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.buttons {
	display: flex;
	justify-content: right;

	padding-right: 1rem;
	padding-top: 1rem;

	border-top: solid 1px #d7d7d7;
}
</style>
