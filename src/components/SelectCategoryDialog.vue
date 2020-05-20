<template>
	<kx-base-dialog title="选择分类">
		<div :class="$style.buttons">

			<template v-if="current">
				<h3 class="compact minor-text">当前分类：</h3>
				<img
					class="small head"
					:class="$style.cover"
					:src="current.cover"
					alt="分类图标"
				>
				<span :class="$style.name">{{current.name}}</span>
			</template>
			<div v-else :class="$style.hold"></div>

			<div class="btn-group">
				<kx-button
					:disabled="current === null"
					@click="gotoParent"
				>
					<i class="fa fa-arrow-left"></i>
					<span> 回到父级</span>
				</kx-button>

				<kx-button
					:disabled="current === null"
					@click="gotoTop"
				>
					<i class="fas fa-arrow-up"></i>
					<span> 返回顶层</span>
				</kx-button>
			</div>
		</div>

		<ul class="clean-list" :class="$style.cards">
			<li
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
					<img
						class="head"
						:class="$style.cover"
						:src="cate.cover"
						alt="分类图标"
					>
					<h3 :class="$style.name">{{cate.name}}</h3>
				</div>
			</li>
		</ul>

		<div :class="$style.footer">
			<div v-if="multiple" :class="$style.tip">
				已选择{{ selected.length }}个分类
			</div>
			<div v-else :class="$style.tip">
				已选择：{{ selected.length ? selected[0].name : '' }}
			</div>

			<div class="btn-group">
				<kx-button
					class="second"
					@click="clear"
				>
					清空选择
				</kx-button>
				<kx-button
					@click="cancel"
				>
					取消
				</kx-button>
				<kx-button
					class="primary"
					:disabled="!selected.length"
					@click="ok"
				>
					确定
				</kx-button>
			</div>
		</div>
	</kx-base-dialog>
</template>

<script>
import api from "@/api";
import { deleteOn } from "@/utils";

export default {
	name: "SelectCategoryDialog",
	props: {
		multiple: {
			type: Boolean,
			default: false,
		},
		filter: {
			type: Function,
			default: () => true,
		},
	},
	data: () => ({
		selected: [],
		children: [],
		current: null,
		stack: [],
	}),
	computed: {
		categories() {
			return this.children.filter(this.filter);
		},
	},
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
			this.$dialog.confirm(multiple ? selected : selected[0]);
		},
		cancel() {
			this.$dialog.close();
		},
		clear() {
			this.selected.forEach(cate => cate.selected = false);
			this.selected = [];
		},
		/*
		 * TODO:一部分逻辑跟 CategoryConsole 是重合的，但是Vue没有像ReactHooks
		 * 这样的复用方法，用Mixin又不太好毕竟要被废弃了。
		 */
		showChild(category) {
			this.stack.push(this.current);
			this.current = category;
			api.category.getChildren(category.id).then(res => this.children = res);
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
	},
	created() {
		api.category.getChildren(0).then(res => this.children = res);
	},
};
</script>

<style module lang="less">
@import "../css/imports";

.buttons {
	display: flex;
	align-items: center;

	& > .name {
		flex: 1;
	}

	& > .cover {
		margin: 0 .5rem;
	}
}

.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, 9rem);
	grid-gap: .8rem;
	justify-content: center;
	align-items: start;

	width: 50vmax;
	height: 50vmin;
	margin: 1rem 0;
	overflow: auto;
}

.footer {
	display: flex;
	justify-content: space-between;
	padding-top: 1rem;
	border-top: solid 1px #d7d7d7;
}

.category {
	composes: click-item from global;
	border: solid 1px #d7d7d7;

	&:hover, &:focus {
		border-color: @color-primary;
	}

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

.cover {
	display: inline-block;
	margin-bottom: 1rem;
}

.hold {
	height: 3rem;
	flex: 1;
}
</style>
