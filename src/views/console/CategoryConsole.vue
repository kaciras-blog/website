<template>
	<div :class='$style.buttons'>
		<KxButton
			:disabled='!hasAncestor'
			@click='$data.gotoId(0)'
		>
			<ArrowUpward class='prefix'/>
			返回顶层
		</KxButton>
		<KxButton
			:disabled='!hasAncestor'
			@click='$data.gotoParent()'
		>
			<ArrowLeft class='prefix'/>
			回到父级
		</KxButton>

		<KxButton
			color='second'
			:class='$style.createButton'
			@click='createNew'
		>
			新建分类
		</KxButton>
	</div>

	<CategoryView
		v-if='current'
		:editable='true'
		:item='current'
		@moved='$data.gotoParent()'
		@removed='$data.gotoParent()'
		@change='submit'
	/>

	<h2 :class='$style.childrenTitle' v-if='current'>下级分类</h2>

	<div v-if='!children'>正在加载中</div>

	<ul v-else-if='children.length' :class='$style.cards'>
		<CategoryCard
			v-for='item of children'
			:key='item.id'
			v-bind='item'
			@click='$data.goto(item)'
		/>
	</ul>
	<div v-else :class='$style.empty_holder'>没有下级分类了</div>
</template>

<script>
import { KxButton } from "@kaciras-blog/uikit";
import ArrowLeft from "@material-design-icons/svg/round/arrow_back.svg?sfc";
import ArrowUpward from "@material-design-icons/svg/round/arrow_upward.svg?sfc";
import api from "@/api/index.ts";
import CachedCategoryWalker from "@/components/CachedCategoryWalker.ts";
import CategoryCard from "@/components/CategoryCard.vue";
import CategoryView from "./CategoryView.vue";

const TEMPLATE = {
	name: "新建分类",
	description: "没有",
	theme: 0,
	background: null,
};

export default {
	name: "CategoryConsole",
	components: {
		ArrowLeft,
		ArrowUpward,
		CategoryCard,
		CategoryView,
		KxButton,
	},
	data: () => new CachedCategoryWalker(),
	computed: {
		hasAncestor() {
			return this.current && this.current.id !== 0;
		},
	},
	methods: {
		createNew() {
			const { id, banner } = this.current;
			this.current = Object.assign({ parent: id, banner }, TEMPLATE);
			this.children = [];
		},
		async submit() {
			const { current } = this;

			if (typeof current.id === "number") {
				await api.category.update(current.id, current);
			} else {
				await api.category.create(current, current.parent);
			}

			this.$data.invalidCache(current);
			this.$dialog.alertSuccess("保存成功");
		},
	},
	beforeMount() {
		this.$data.goto(0);
	},
};
</script>

<style module lang="less">
@import "../../css/imports.less";

.buttons {
	composes: global(console-toolbar);
	display: flex;
	gap: 10px;
	justify-content: space-between;
}

.createButton {
	margin-left: auto;
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

	margin-bottom: 2rem; /* 控制台body是网格布局元素，padding有点问题 */
}

.empty_holder {
	padding: 50px;
	margin-bottom: 2rem;

	font-size: 16px;
	text-align: center;
}
</style>
