<template>
<div>
	<div class="flex between">
		<button class="primary round" @click="showEditView()">添加分类</button>
		<button class="round" @click="refresh()"><i class="fas fa-sync"></i>刷新</button>
	</div>
	<div class="card-container">
		<div class="flex vertical card"
			 :key="C.id"
			 v-for="C in categories">

			<img :src="'/image/'+ C.cover">
			<a class="category-header" :href="'/index?category=' + C.id">{{C.name}}</a>
			<p><i title="文章数" class="far fa-edit"></i>{{C.articleCount}}</p>
			<div class="flex compact momo">
				<button class="square primary" @click="showEditView(C.id)">修改</button>
				<button class="square dangerous" @click="deleteCategory(C.id)">删除</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import api from "../apis";

export default {
	name: "category",
	data() {
		return {categories: []};
	},
	methods: {
		deleteCategory(id) {
			api.category.deleteOne(id).then(this.refresh);
		},
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
.card-container {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
</style>
