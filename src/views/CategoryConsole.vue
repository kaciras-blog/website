<template>
	<div>
		<div class="buttons">
			<button><i class="fa fa-arrow-left"></i>返回顶层</button>
			<button>新建分类</button>
		</div>
		<category-view :editable="true"></category-view>
	</div>
</template>

<script>
import api from "../apis";
import CategoryView from "../components/CategoryView";

export default {
	name: "CategoryConsole",
	components: {
		CategoryView,
	},
	data() {
		return {categories: []};
	},
	methods: {
		refresh() {
			api.category.getChildren(0).then(arr => {
				this.categories = [];
				arr.forEach(v => this.categories.push(v));
			});
		},
		showEditView(id = null) {
			this.$router.push(id ? "category/detail/" + id : "category/detail");
		},
	},
	created() {
		this.refresh();
	},
};
</script>

<style scoped>
.buttons {
	margin-bottom: 1rem;
}
</style>
