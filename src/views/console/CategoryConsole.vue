<template>
	<div>
		<div class="buttons">
			<div class="button-group">
				<button :disabled="current === null" @click="gotoTop">
					<i class="fas fa-arrow-up"></i><span>返回顶层分类</span>
				</button>
				<button :disabled="current === null" @click="gotoParent">
					<i class="fa fa-arrow-left"></i><span>回到父级</span>
				</button>
			</div>
			<button class="second" @click="createNew">新建分类</button>
		</div>
		<category-view v-if="current" :current="current" :editable="true"/>

		<div class="children-title" v-if="current">下级分类</div>
		<div class="cards">
			<category-card
				v-for="item of children"
				:key="item.id"
				v-bind="item"
				@click.native="goto(item)"/>
		</div>
	</div>
</template>

<script>
import CategoryView from "../../components/CategoryView";
import CategoryCard from "../../components/CategoryCard";
import api from "../../apis";

const _default = {
	name: "新建分类",
	cover: "/image/category-default.png",
	description: "",
};

export default {
	name: "CategoryConsole",
	components: {
		CategoryCard,
		CategoryView,
	},
	data: () => ({
		current: null,
		children: [],
		stack: [],
	}),
	methods: {
		toRoot() {
			this.id = 0;
		},
		toParent() {
			this.id = 11;
		},
		goto(category) {
			this.stack.push(this.current);
			this.current = category;
			this.children = api.category.getChildren(category.id).then(r => this.children = r);
		},
		gotoTop() {
			this.current = null;
			this.children = api.category.getChildren(0).then(r => this.children = r);
		},
		gotoParent() {
			this.current = this.stack.pop();
			const id = this.current ? this.current.id : 0;
			this.children = api.category.getChildren(id).then(r => this.children = r);
		},
		createNew() {
			this.stack.push(this.current);
			this.current = _default;
			this.children = [];
		},
	},
	created() {
		api.category.getChildren(0).then(r => this.children = r);
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.buttons {
	margin-bottom: 1rem;
	display: flex;
	justify-content: space-between;
}

.children-title {
	font-size: 1.5rem;
	width: 100%;
	margin: 1rem 0;
	padding: 0 1rem 1rem;
	border-bottom: solid 1px @color-border;
}

.cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;

	margin-bottom: 2rem; // 控制台body是网格布局元素，padding有点问题
}
</style>
