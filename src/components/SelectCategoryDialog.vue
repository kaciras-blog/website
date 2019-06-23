<template>
	<kx-base-dialog title="选择分类">
		<div :class="$style.buttons">

			<template v-if="current">
				<h3 class="compact minor-text">当前分类：</h3>
				<img
					class="small head"
					:class="$style.head"
					:src="current.cover"
					alt="分类图标"
				>
				<span :class="$style.name">{{current.name}}</span>
			</template>
			<div v-else :class="$style.hold"></div>

			<div class="btn-group">
				<kx-button
					:disabled="current === null"
					@click="gotoParent">
					<i class="fa fa-arrow-left"></i><span>回到父级</span>
				</kx-button>
				<kx-button
					:disabled="current === null"
					@click="gotoTop">
					<i class="fas fa-arrow-up"></i><span>返回顶层</span>
				</kx-button>
			</div>
		</div>

		<div :class="$style.cards">
			<div
				v-for="cate of categories"
				:key="cate.id"
				:class="{ [$style.category]: true, selected: cate.selected }"
				@click="showChild(cate)"
			>
				<kx-check-box
					:value="cate.selected"
					@click.native.stop
					@changed="select(cate)"
				/>
				<div :class="$style.categoryWrapper">
					<img class="head"
						 :class="$style.head"
						 :src="cate.cover"
						 alt="分类图标">
					<h3 :class="$style.name">{{cate.name}}</h3>
				</div>
			</div>
		</div>

		<div :class="$style.footer">

			<div v-if="multiple" :class="$style.tip">
				已选择{{ selected.length }}个分类
			</div>
			<div v-else :class="$style.tip">
				已选择：{{ selected.length ? selected[0].name : '' }}
			</div>

			<div class="btn-group">
				<kx-button class="second" @click="clear">清空选择</kx-button>
				<kx-button @click="cancel">取消</kx-button>
				<kx-button class="primary" @click="ok">确定</kx-button>
			</div>
		</div>
	</kx-base-dialog>
</template>

<script>
import api from "../api";
import { deleteOn } from "../utils";

export default {
	name: "SelectCategoryDialog",
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
		select (category) {
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
		ok () {
			const { multiple, selected } = this;
			this.$dialog.close(multiple ? selected : selected[0]);
		},
		cancel () {
			this.$dialog.close();
		},
		clear () {
			this.selected.forEach(cate => cate.selected = false);
			this.selected = [];
		},
		/*
		 * TODO:一部分逻辑跟 CategoryConsole 是重合的，但是Vue没有像ReactHooks
		 * 这样的复用方法，用Mixin又不太好毕竟要被废弃了。
		 */
		showChild (category) {
			this.stack.push(this.current);
			this.current = category;
			api.category.getChildren(category.id).then(res => this.categories = res);
		},
		gotoTop () {
			this.current = null;
			api.category.getChildren(0).then(r => this.categories = r);
		},
		gotoParent () {
			this.current = this.stack.pop();
			const id = this.current ? this.current.id : 0;
			api.category.getChildren(id).then(r => this.categories = r);
		},
	},
	created () {
		api.category.getChildren(0).then(res => this.categories = res);
	},
};
</script>

<style module lang="less">
@import "../css/Imports";

.cards {
	width: 50vmax;
	height: 50vmin;

	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start; // [PostCss] start value has mixed support, consider using flex-start instead
	overflow: auto;
}

.footer {
	display: flex;
	justify-content: space-between;
	padding-top: 1rem;
	border-top: solid 1px #d7d7d7;
}

.category {
	margin: .5rem;
	width: 9rem;

	.click-item;
	border: solid 1px #d7d7d7;

	&.selected {
		border-color: @color-primary;
	}

	& :global(.check-box-mark) {
		.extend-click(1rem, 0, 0, 1rem);
		float: right;
		border-radius: 0;
		border-top-width: 0;
		border-right-width: 0;
	}

	& :global(.kx-check-box) {
		display: block;
	}
}

.categoryWrapper {
	text-align: center;
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

.hold {
	height: 3rem;
	flex: 1;
}
</style>
