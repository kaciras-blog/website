<template>
	<kx-dialog class="category-selector" :draggable="true">
		<h3 slot="title">选择分类</h3>

		<div class="buttons">
			<template v-if="current">
				<h3 class="compact minor-text">当前分类：</h3>
				<img class="small head" :src="current.cover" alt="分类图标">
				<span class="name">{{current.name}}</span>
			</template>
			<div v-else class="hold"></div>
			<button :disabled="current === null"
					@click="gotoParent">
				<i class="fa fa-arrow-left"></i><span>回到父级</span>
			</button>
			<button :disabled="current === null"
					@click="gotoTop">
				<i class="fas fa-arrow-up"></i><span>返回顶层</span>
			</button>
		</div>

		<div class="cards">
			<div v-for="cate of categories"
				 :key="cate.id"
				 class="category"
				 :class="{ selected: cate.selected }">

				<kx-check-box :value="cate.selected" @changed="select(cate)"/>
				<div @click="showChild(cate)">
					<img class="head" :src="cate.cover" alt="分类图标">
					<h3 class="name">{{cate.name}}</h3>
				</div>
			</div>
		</div>

		<div slot="footer" class="footer">
			<div v-if="multiple" class="tip">已选择：{{ selected.length }} 个分类</div>
			<div v-else class="tip">已选择：{{ selected.length ? selected[0].name : '' }}</div>
			<div>
				<button class="second" @click="clear">清空选择</button>
				<button @click="cancel">取消</button>
				<button @click="ok">确定</button>
			</div>
		</div>
	</kx-dialog>
</template>

<script>
import CategoryCard from "./CategoryCard";
import api from "../apis";
import { deleteOn } from "../utils";

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
		current: null,
		stack: [],
	}),
	methods: {
		select(category) {
			if (category.selected) {
				deleteOn(this.selected, cate => cate.id === category.id);
				category.selected = false;
			} else {
				if (!this.multiple) {
					const old = this.selected.pop();
					if (old) {
						old.selected = false;
					}
				}
				this.selected.push(category);
				this.$set(category, "selected", true);
			}
		},
		ok() {
			const { multiple, selected } = this;
			if(multiple) {
				this.$dialog.close(selected.map(c => c.id));
			} else {
				this.$dialog.close(selected[0] && selected[0].id);
			}
		},
		cancel() {
			this.$dialog.close();
		},
		clear() {
			this.selected.forEach(cate => cate.selected = false);
			this.selected = [];
		},
		showChild(category) {
			this.stack.push(this.current);
			this.current = category;
			api.category.getChildren(category.id).then(res => this.categories = res);
		},
		gotoTop() {
			this.current = null;
			api.category.getChildren(0).then(r => this.categories = r);
		},
		gotoParent() {
			this.current = this.stack.pop();
			const id = this.current ? this.current.id : 0;
			api.category.getChildren(id).then(r => this.categories = r);
		},
	},
	created() {
		api.category.getChildren(0).then(res => this.categories = res);
	},
};
</script>

<style lang="less">
.category-selector .kx-dialog-body {
	/*padding: 0;*/
}
</style>

<style scoped lang="less">
@import "../css/ToBeImpoert";

.cards {
	width: 50vmax;
	height: 50vmin;

	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: start;
	overflow: auto;
}

.footer {
	display: flex;
	justify-content: space-between;

	padding: 1rem;

	border-top: solid 1px #d7d7d7;
}

.category {
	margin: .5rem;
	width: 9rem;

	.click-item;
	text-align: center;
	border: solid 1px #d7d7d7;

	&.selected {
		border-color: @color-primary;
	}

	& /deep/ .check-box-mark {
		.extend-click(1rem, 0, 0, 1rem);
		float: right;
		border-radius: 0;
		border-top-width: 0;
		border-right-width: 0;
	}
}

.tip {
	color: @color-text-minor;
	font-size: 1.1rem;
	line-height: 1.8;
}

.head {
	display: inline-block;
	margin-bottom: 1rem;
}

.buttons {
	display: flex;
	padding-bottom: 1rem;
	align-items: center;

	& > .name {
		flex: 1;
	}
	& > .head {
		margin: 0 .5rem;
	}
}

.hold{
	height: 3rem;
	flex: 1;
}
</style>
