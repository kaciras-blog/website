<template>
	<div>
		<div class="btn-group" :class="$style.toolbar">
			<kx-button @click="createNew">添加</kx-button>
			<kx-button @click="load">重新加载</kx-button>
			<kx-button class="primary" @click="submit">应用更改</kx-button>
		</div>

		<div ref="container">
			<template v-for="item of cards">
				<div
					v-if="item.placeholder"
					:key="item.id"
					:class="$style.placeholder"
				/>
				<card-list-item
					v-else
					:key="item.id"
					:class="$style.card"
					v-bind="item"
					@switch-expand="item.expand = !item.expand"
					@remove="remove"
					@drag-start="drag($event, item)"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import { moveElement, observeMouseMove } from "@kaciras-blog/uikit";
import api from "@/api";
import { attachRandomId, deleteOn } from "@/utils";
import CardListItem from "./CardListItem";

const CARD_TEMPLATE = {
	picture: "/static/img/placeholder.png",
	name: "新的卡片",
	link: "",
	description: "",
};

class ListDraggingRegion {

	constructor(container) {
		const region = container.getBoundingClientRect();
		const item = container.children[0].getBoundingClientRect();

		this.offset = region.top + 10;
		this.territory = item.height + 20;
	}

	// 索引必须要取整
	getIndex(x, y) {
		return Math.floor((y - this.offset) / this.territory);
	}
}

export default {
	name: "CardsConsole",
	components: {
		CardListItem,
	},
	data: () => ({
		cards: [],
		initialized: false,
		dragging: null,
	}),
	methods: {
		receiveMessage(data) {
			if (this.initialized) {
				this.addCard(data);
			} else {
				this.$watch("initialized", () => this.addCard(data));
			}
		},
		createNew() {
			this.addCard(CARD_TEMPLATE);
		},
		addCard(data) {
			this.cards.unshift(attachRandomId({ expand: true, card: data }));
		},
		remove(id) {
			deleteOn(this.cards, (s) => s.id === id);
		},
		async load() {
			const cards = await api.recommend.getCards();
			this.cards = cards.map(card => attachRandomId({ card, expand: false }));
		},
		submit() {
			api.recommend.setCards(this.cards.map(item => item.card))
				.then(() => this.$dialog.alertSuccess("修改成功"))
				.catch((e) => this.$dialog.alertError("修改失败", e.message));
		},
		async drag(event, item) {
			const { cards } = this;

			// 查找拖动页的索引，并折叠全部轮播页
			let holderIndex;
			for (let i = 0; i < cards.length; i++) {
				if (cards[i].id === item.id) {
					holderIndex = i;
				}
				cards[i].expand = false;
			}

			// 等到全部折叠完了再计算高度。
			await this.$nextTick();

			/*
			 * 获取被拖动元素和容器元素的大小位置，计算出每个轮播标题栏的置换范围，在拖动时
			 * 不断检测被拖动元素位置与其他元素是否进入其他元素的置换范围，不断调整 cards
			 * 数组。
			 *
			 * 下面第一行Vue有BUG，不能使用组件的.$el，否则getBoundingClientRect()返回值是旧的。
			 */
			const el = this.$refs.container.children[holderIndex];
			const rect = el.getBoundingClientRect();

			const region = new ListDraggingRegion(this.$refs.container);

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

			// 原来的位置替换为占位元素
			this.$set(cards, holderIndex, {
				id: Symbol(),
				placeholder: true,
			});

			function insertInto(i) {
				if (holderIndex === i) {
					return;
				}
				const holder = cards.splice(holderIndex, 1)[0];
				holderIndex = i;
				cards.splice(i, 0, holder);
			}

			observeMouseMove().pipe(moveElement(event, dragEl)).subscribe({
				next: ({ x, y }) => {
					insertInto(Math.max(0, Math.min(region.getIndex(x, y), cards.length - 1)));
				},
				complete: () => {
					dragEl.remove();
					this.$set(cards, holderIndex, item);
				},
			});
		},
	},
	async beforeMount() {
		await this.load();
		this.initialized = true;
	},
};
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
	text-align: right;
}
</style>
