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
					:disabled="!hasAncestor"
					@click="walker.gotoParent()"
				>
					<i class="fa fa-arrow-left"></i>
					<span> 回到父级</span>
				</kx-button>

				<kx-button
					:disabled="!hasAncestor"
					@click="walker.goto(0)"
				>
					<i class="fas fa-arrow-up"></i>
					<span> 返回顶层</span>
				</kx-button>
			</div>
		</div>

		<ul class="clean-list" :class="$style.cards">
			<li
				v-for="category of categories"
				:key="category.id"
				:class="{ [$style.category]: true, selected: category.selected }"
				@click="walker.goto(category)"
			>
				<kx-check-box
					:value="category.selected"
					@click.native.stop
					@changed="select(category)"
				/>
				<div :class="$style.categoryWrapper">
					<img
						class="head"
						:class="$style.cover"
						:src="category.cover"
						alt="分类图标"
					>
					<h3 :class="$style.name">{{category.name}}</h3>
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
import { deleteOn } from "@/utils";
import CachedCategoryWalker from "./CachedCategoryWalker";

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
		walker: new CachedCategoryWalker(),
	}),
	computed: {
		current() {
			return this.walker.current;
		},
		categories() {
			const { children } = this.walker;
			return children ? children.filter(this.filter) : [];
		},
		hasAncestor() {
			const { current } = this.walker;
			return current && current.id !== 0;
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
	},
	created() {
		this.walker.goto(0);
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
