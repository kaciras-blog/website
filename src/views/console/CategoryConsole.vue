<template>
	<div>
		<div :class="$style.buttons">
			<div class="btn-group">
				<kx-button
					:disabled="!stack.length"
					@click="gotoTop"
					icon="fas fa-arrow-up"
				>
					返回顶层
				</kx-button>
				<kx-button
					:disabled="!stack.length"
					@click="gotoParent"
					icon="fa fa-arrow-left"
				>
					回到父级
				</kx-button>
			</div>

			<kx-button
				class="second"
				@click="createNew"
			>
				新建分类
			</kx-button>
		</div>

		<category-view
			v-if="current"
			:editable="true"
			:item="current"
			@moved="goto"
			@removed="gotoParent"
			@change="submit"
		/>

		<div :class="$style.childrenTitle" v-if="current">下级分类</div>

		<ul v-if="children.length" :class="$style.cards">
			<category-card
				v-for="item of children"
				:key="item.id"
				v-bind="item"
				@click="goto(item)"
			/>
		</ul>
		<div v-else :class="$style.empty_holder">没有下级分类了</div>
	</div>
</template>

<script>
import api from "@/api";
import CategoryCard from "@/components/CategoryCard";
import CategoryView from "./CategoryView";

const CATEGORY_TEMPLATE = {
	name: "新建分类",
	cover: "/static/img/category.png",
	description: "没有",
	theme: 0,
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
		async goto(category) {
			this.stack.push(this.current);
			this.current = category;
			this.children = await api.category.getChildren(category.id);
		},
		async gotoTop() {
			this.current = this.stack[0];
			this.stack.splice(0);
			this.children = await api.category.getChildren(0);
		},
		async gotoParent() {
			this.current = this.stack.pop();
			const id = this.current ? this.current.id : 0;
			this.children = await api.category.getChildren(id);
		},
		createNew() {
			this.stack.push(this.current);
			this.current = Object.assign({}, CATEGORY_TEMPLATE);
			this.children = [];
		},
		async submit() {
			const { current, stack } = this;

			if (typeof current.id === "number") {
				await api.category.update(current.id, current);
			} else {
				const parent = stack.length ? stack[stack.length - 1].id : 0;
				await api.category.create(current, parent);
			}

			this.$dialog.alertSuccess("保存成功");
		},
	},
	async beforeMount() {
		this.current = await api.category.get(0, true);
		this.children = this.current.children;
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.buttons {
	composes: global(console-toolbar);
	display: flex;
	justify-content: space-between;
}

.childrenTitle {
	font-size: 1.5rem;
	width: 100%;
	padding: 20px 0;
	border-bottom: solid 1px @color-border;
}

.cards {
	list-style: none;

	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	margin-bottom: 2rem; // 控制台body是网格布局元素，padding有点问题
}

.empty_holder {
	padding: 50px;
	margin-bottom: 2rem;

	font-size: 16px;
	text-align: center;
}
</style>
