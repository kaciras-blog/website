<template>
	<main>
		<div class="buttons">
			<div class="btn-group">
				<kx-button
					:disabled="current === null"
					@click="gotoTop"
					icon="fas fa-arrow-up">
					返回顶层
				</kx-button>
				<kx-button
					:disabled="current === null"
					@click="gotoParent"
					icon="fa fa-arrow-left">
					回到父级
				</kx-button>
			</div>

			<kx-button
				class="second"
				@click="createNew">
				新建分类
			</kx-button>
		</div>

		<category-view
			v-if="current"
			:editable="true"
			:item="current"
			@change="submit"
			@removed="gotoParent"/>

		<div class="children-title" v-if="current">下级分类</div>
		<div class="cards">
			<category-card
				v-for="item of children"
				:key="item.id"
				v-bind="item"
				@click="goto(item)"/>

			<span v-if="!children.length">没有了</span>
		</div>
	</main>
</template>

<script>
import CategoryView from "./CategoryView";
import CategoryCard from "../../components/CategoryCard";
import api from "../../api";

const _default = {
	name: "新建分类",
	cover: "/image/category-default.png",
	description: "没有",
	background: null,
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
		goto(category) {
			this.stack.push(this.current);
			this.current = category;
			api.category.getChildren(category.id).then(r => this.children = r);
		},
		gotoTop() {
			this.current = null;
			api.category.getChildren(0).then(r => this.children = r);
		},
		gotoParent() {
			this.current = this.stack.pop();
			const id = this.current ? this.current.id : 0;
			api.category.getChildren(id).then(r => this.children = r);
		},
		createNew() {
			this.stack.push(this.current);
			this.current = Object.assign({}, _default);
			this.children = [];
		},
		async submit() {
			const { current, stack, $dialog } = this;
			if (current.id) {
				await api.category.update(current.id, current);
				await $dialog.messageBox("修改分类", "修改成功");
			} else {
				const parent = stack.length ? stack[stack.length - 1].id : 0;
				await api.category.create(current, parent);
				await $dialog.messageBox("新建分类", "添加成功");
			}
		},
	},
	created() {
		api.category.getChildren(0).then(r => this.children = r);
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImport";

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
