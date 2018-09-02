<template>
	<kx-dialog class="category-selector" :draggable="true">
		<h3 slot="title">选择分类</h3>
		<category-view></category-view>
	</kx-dialog>
</template>

<script>
import CategoryView from "./CategoryView";

export default {
	name: "SelectCategoryDialog",
	components: {CategoryView},
};
</script>

<style lang="less">
.category-selector {

	& .kx-dialog-body {
		padding: 0;
	}
	& .kx-dialog {
		width: 60%;
		height: 80%;
	}
}
</style>
