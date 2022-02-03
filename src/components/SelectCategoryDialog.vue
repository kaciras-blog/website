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
				<span :class="$style.name">{{ current.name }}</span>
			</template>
			<div v-else :class="$style.hold"></div>

			<div class="btn-group">
				<kx-button
					type="outline"
					:disabled="!hasAncestor"
					@click="walker.gotoParent()"
				>
					<ArrowLeft class="prefix"/>
					回到父级
				</kx-button>

				<kx-button
					type="outline"
					:disabled="!hasAncestor"
					@click="walker.goto(0)"
				>
					<ArrowUpward class="prefix"/>
					返回顶层
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
					:modelValue="!!category.selected"
					@click.stop
					@update:modelValue="select(category)"
				/>
				<div :class="$style.categoryWrapper">
					<img
						class="head"
						:class="$style.cover"
						:src="category.cover"
						alt="分类图标"
					>
					<h3 :class="$style.name">{{ category.name }}</h3>
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

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import ArrowLeft from "@material-design-icons/svg/round/arrow_back.svg?sfc";
import ArrowUpward from "@material-design-icons/svg/round/arrow_upward.svg?sfc";
import { Category } from "@/api";
import { deleteOn } from "@/utils";
import CachedCategoryWalker from "./CachedCategoryWalker";
import { useDialog } from "@kaciras-blog/uikit";

interface SelectCategoryDialogProps {
	multiple?: boolean;
	filter?: () => boolean;
}

const props = withDefaults(defineProps<SelectCategoryDialogProps>(), {
	multiple: false,
	filter: () => true,
});

const dialog = useDialog();

const selected = ref<Category[]>([]);
const walker = reactive(new CachedCategoryWalker());

walker.goto(0);

const current =  computed(() => walker.current);

const categories = computed(() => {
	const { children } = walker;
	return children ? children.filter(props.filter) : [];
});

const hasAncestor = computed(() => {
	const { current } = walker;
	return current && current.id !== 0;
});

function select(category: any) {
	if (category.selected) {
		deleteOn(selected.value, cate => cate.id === category.id);
		category.selected = false;
	} else {
		if (!props.multiple) {
			const old = selected.value.pop();
			if (old) {
				(old as any).selected = false;
			}
		}
		category.selected = true;
		selected.value.push(category);
	}
}

function ok() {
	const value = selected.value;
	dialog.confirm(props.multiple ? value : value[0]);
}

function cancel() {
	dialog.close();
}

function clear() {
	const { value } = selected;
	value.splice(0, value.length).forEach(cate => cate.selected = false);
}
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
