<template>
	<div :class='$style.toolbar'>
		<KxButton type='outline' @click='createNew'>添加</KxButton>
		<KxButton type='outline' @click='load'>重新加载</KxButton>
		<KxButton color='primary' @click='submit'>应用更改</KxButton>
	</div>

	<div ref='container'>
		<template v-for='item of cards'>
			<div
				v-if='item.placeholder'
				:key='item.id'
				:class='$style.placeholder'
			/>
			<CardListItem
				v-else
				:key='item.id'
				:class='$style.card'
				v-bind='item'
				@switch-expand='item.expand = !item.expand'
				@remove='remove'
				@drag-start='drag($event, item)'
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { KxButton, moveElement, observeMouseMove, useDialog } from "@kaciras-blog/uikit";
import api, { Card } from "@/api";
import { attachRandomId, deleteOn } from "@/utils";
import CardListItem from "./CardListItem.vue";

const CARD_TEMPLATE: Card = {
	name: "新的卡片",
	link: "",
	description: "",
};

class ListDraggingRegion {

	private readonly territory: number;
	private readonly offset: number;

	constructor(container: HTMLElement) {
		const region = container.getBoundingClientRect();
		const item = container.children[0].getBoundingClientRect();

		this.offset = region.top + 10;
		this.territory = item.height + 20;
	}

	// 索引必须要取整
	getIndex(x: number, y: number) {
		return Math.floor((y - this.offset) / this.territory);
	}
}

interface CardEntry {
	id: number;
	expand: boolean;
	card: Card;
	placeholder?: boolean;
}

const dialog = useDialog();

const container = ref();
const cards = ref<CardEntry[]>([]);
const initialized = ref(false);

// const dragging = ref(null);

function receiveMessage(data: Card) {
	if (initialized.value) {
		addCard(data);
	} else {
		watch(initialized, () => addCard(data));
	}
}

defineExpose({ receiveMessage });

function createNew() {
	addCard(CARD_TEMPLATE);
}

function addCard(data: Card) {
	cards.value.unshift(attachRandomId({ expand: true, card: data }));
}

function remove(id: number) {
	deleteOn(cards.value, (s) => s.id === id);
}

async function load() {
	const data = await api.cards.getAll();
	cards.value = data.map(card => attachRandomId({ card, expand: false }));
}

function submit() {
	api.cards.setCards(cards.value.map(item => item.card))
		.then(() => dialog.alertSuccess("修改成功"))
		.catch(e => dialog.alertError("修改失败", e.message));
}

load().then(() => initialized.value = true);

async function drag(event: any, item: CardEntry) {
	const list = cards.value;

	// 查找拖动页的索引，并折叠全部轮播页
	let holderIndex = 0;
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === item.id) {
			holderIndex = i;
		}
		list[i].expand = false;
	}

	// 等到全部折叠完了再计算高度。
	await nextTick();

	/*
	 * 获取被拖动元素和容器元素的大小位置，计算出每个轮播标题栏的置换范围，在拖动时
	 * 不断检测被拖动元素位置与其他元素是否进入其他元素的置换范围，不断调整 list
	 * 数组。
	 *
	 * 下面第一行Vue有BUG，不能使用组件的.$el，否则getBoundingClientRect()返回值是旧的。
	 */
	const el = container.value.children[holderIndex];
	const rect = el.getBoundingClientRect();

	const region = new ListDraggingRegion(container.value);

	// 被拖动元素放到单独的位置，并设为绝对定位。
	const dragEl = el.cloneNode(true);
	Object.assign(dragEl.style, {
		position: "fixed",
		left: rect.left + "px",
		top: rect.top + "px",
		width: rect.width + "px",
		zIndex: 10000,
		margin: 0, // 防止间距干扰定位
	});
	document.body.appendChild(dragEl);

	// 原来的位置替换为占位元素，因为类型不同所以转了 any
	(list as any)[holderIndex] = {
		id: Symbol(),
		placeholder: true,
	};

	function insertInto(i: number) {
		if (holderIndex === i) {
			return;
		}
		const holder = list.splice(holderIndex, 1)[0];
		holderIndex = i;
		list.splice(i, 0, holder);
	}

	observeMouseMove().pipe(moveElement(event, dragEl)).subscribe({
		next: ({ x, y }) => {
			insertInto(Math.max(0, Math.min(region.getIndex(x, y), list.length - 1)));
		},
		complete: () => {
			dragEl.remove();
			list[holderIndex] = item;
		},
	});
}
</script>

<style module lang="less">
@import "../../css/imports";

.card {
	margin: 20px 0;
}

.placeholder {
	composes: card;
	height: 2.6rem;
}

.toolbar {
	composes: btn-group from global;
	text-align: right;
}
</style>
