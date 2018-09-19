<template>
	<div>
		<div class="buttons">
			<div class="button-group">
				<button><i class="fa fa-arrow-left"></i><span>返回顶层分类</span></button>
				<button><i class="fa fa-arrow-top"></i><span>回到父级</span></button>
			</div>
			<button class="second">新建分类</button>
		</div>
		<category-view :editable="true"/>
	</div>
</template>

<script>
import CategoryView from "../../components/CategoryView";

export default {
	name: "CategoryConsole",
	components: {
		CategoryView,
	},
	data: () => ({
		id: 0,
	}),
	methods:{
		toRoot() {
			this.id = 0;
		},
		toParent() {
			this.id = 11;
		},
	},
};
</script>

<style scoped>
.buttons {
	margin-bottom: 1rem;
	display: flex;
	justify-content: space-between;
}


</style>
