<template>
<div>
	<div class="buttons">
		<button><i class="fa fa-arrow-left"></i>返回顶层</button>
		<button>新建子分类</button>
	</div>
	<category-view :editable="true"></category-view>
</div>
</template>

<script>
import CategoryView from "../components/CategoryView";

export default {
	name: "CategoryEditor",
	components: {
		CategoryView,
	},
};
</script>

<style scoped>
.buttons {
	margin-bottom: 1rem;
}
</style>
