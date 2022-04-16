<template>
	<div>
		<div
			:class="$style.infoSection"
			@click.self="setBackground"
			:style="styleVars"
			:title="editable ? '点击换背景' : null"
		>
			<div :class="$style.infoPanel">
				<img
					class="head"
					:class="$style.head"
					:src="item.cover ?? DEFAULT_CODER"
					:title="editable ? '点击换头像' : null"
					alt="图标"
					@click="setCover"
				>
				<input
					v-if="editable"
					v-model="item.name"
					title="名称"
					class="dark"
					:class="$style.name"
				>
				<span v-else :class="$style.name">
					{{ item.name }}
				</span>

				<textarea
					v-if="editable"
					v-model="item.description"
					title="描述"
					class="dark input"
					:class="$style.desc"
				/>

				<span v-else :class="$style.desc">
					{{ item.description }}
				</span>

				<div :class="$style.buttons" v-if="editable">
					<KxButton
						type="outline"
						color="primary"
						@click="$emit('change')"
					>
						应用更改
					</KxButton>
					<KxButton
						type="outline"
						color="primary"
						@click="move"
					>
						移动
					</KxButton>
					<KxButton
						type="outline"
						color="dangerous"
						@click="remove"
					>
						删除
					</KxButton>
				</div>
			</div>
		</div>

		<div v-if="editable" :class="$style.optionSection">
			<h3>导航栏背景色：</h3>
			<KxRadioBoxGroup v-model="item.theme" name="theme">
				<KxRadioBox :value="0">默认</KxRadioBox>
				<KxRadioBox :value="1">明亮</KxRadioBox>
				<KxRadioBox :value="2">暗色</KxRadioBox>
			</KxRadioBoxGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DEFAULT_CODER from "@/assets/img/category.png";
import { useDialog, KxButton, KxRadioBoxGroup, KxRadioBox } from "@kaciras-blog/uikit";
import api from "@/api";
import SelectCategoryDialog from "@/components/SelectCategoryDialog.vue";
import MoveCategoryDialog from "./MoveCategoryDialog.vue";

interface CategoryViewProps {
	item: any;
	editable: boolean;
	parent?: number;
}

const props = defineProps<CategoryViewProps>();
const emit = defineEmits(["moved", "removed", "change"]);

const dialog = useDialog();

const styleVars = computed(() => {
	const { background, banner } = props.item;
	const vars: Record<string, string> = {};

	if (props.editable) {
		vars["--cursor"] = "pointer";
	}
	if (background) {
		vars["--background"] = `url(${background})`;
	} else {
		vars["--background"] = `url(${banner.image})`;
	}
	return vars;
});

function setCover() {
	if (!props.editable) {
		return;
	}
	api.misc.uploadImageFile().then(name => props.item.cover = name);
}

function setBackground() {
	if (!props.editable) {
		return;
	}
	api.misc.uploadImageFile().then(name => props.item.background = name);
}

async function move() {
	const target = await dialog.show(SelectCategoryDialog).confirmPromise;
	const treeMode = await dialog.show(MoveCategoryDialog).confirmPromise;

	await api.category.move(props.item.id, target.id, treeMode);
	emit("moved", target);
}

async function remove() {
	await api.category.remove(props.item.id, false);
	emit("removed");
}
</script>

<style module lang="less">
@import "../../css/imports";

.infoSection {
	padding: 2.5rem;
	cursor: var(--cursor);

	background-image: var(--background);
	background-size: cover;
	background-position-x: center;
}

.optionSection {
	margin-top: 1rem;
}

.infoPanel {
	display: grid;
	grid-gap: 1rem;

	grid-template-rows: auto auto 10rem;
	grid-template-columns: 1fr auto;
	grid-template-areas: "head button" "name button" "desc desc";
	justify-items: center;

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-rows: auto auto;
		grid-template-columns: auto 1fr auto;
		grid-template-areas: "head desc button" "name desc button";
	}

	cursor: default;
	max-width: 48rem;
	padding: 1rem;
	color: white;
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 1rem;

	& .head {
		margin-left: 2rem;
		margin-right: 2rem;
		margin-bottom: 0;
	}
}

.head {
	grid-area: head;

	display: block;
	margin: 1rem;
	border-radius: 1rem;

	color: black;
	border: solid 3px white;
	background-color: white;
	cursor: var(--cursor);
}

.name {
	grid-area: name;
	width: 9rem;
	text-align: center;

	&:not(input) {
		font-size: 1.2rem;
		font-weight: 600;
	}
}

.desc {
	grid-area: desc;
	justify-self: stretch;
	flex: 1;

	padding: .5rem;
	word-break: break-all;
	text-overflow: ellipsis;
	line-height: 1.4em;

	border: none;
	background: none;
	overflow: hidden;
}

.buttons {
	grid-area: button;
	display: flex;
	flex-direction: column;

	& > :global(.kx-btn) + :global(.kx-btn) {
		margin-top: 10px;
	}
}
</style>
