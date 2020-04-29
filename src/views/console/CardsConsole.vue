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
					v-if="item.holder"
					:class="$style.holder"
					:key="item.id"
				/>
				<card-list-item
					v-else
					:key="item.id"
					:class="$style.card"
					v-bind="item"
					@switch-expand="item.expand = !item.expand"
					@remove="remove"
					@drag-start="e => drag(e, item)"
				/>
			</template>
		</div>

		<!-- 拖动中的元素 -->
		<card-list-item
			v-if="dragging"
			:style="dragging.style"
			v-bind="dragging.item"
		/>
	</div>
</template>

<script>
import { observeMouseMove, elementPosition } from "@kaciras-blog/uikit";
import api from "@/api";
import { deleteOn, attachRandomId } from "@/utils";
import CardListItem from "./CardListItem";

const CARD_TEMPLATE = {
	picture: "/static/img/placeholder.png",
	name: "新的卡片",
	link: "",
	description: "",
};

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
			const container = this.$refs.container.getBoundingClientRect();

			const rect = el.getBoundingClientRect();
			const span = rect.height + 20;
			const yOffset = container.top + 10; // 【坑】列表项的margin在垂直方向上超出容器

			// 被拖动元素放到单独的位置，并设为绝对定位。
			this.dragging = {
				item,
				style: {
					width: container.width + "px",
					position: "absolute",
					top: rect.top + "px",
					left: rect.left + "px",
				},
			};

			// 原轮播页的位置替换为占位元素
			cards[holderIndex] = { holder: true };

			function insertInto(i) {
				if (holderIndex === i) return;
				const holder = cards.splice(holderIndex, 1)[0];
				holderIndex = i;
				cards.splice(i, 0, holder);
			}

			observeMouseMove().pipe(elementPosition(event, el)).subscribe({

				/**
				 * 置换取决于被拖动元素的纵坐标：
				 *     小于 cards 中第一个元素中心：插入到最前
				 *     大于第N个元素中心、小于第N+1个： 插入到N之后
				 *     大于最后一个元素中心：添加到最后
				 *
				 * @param x 被拖动元素新的横坐标
				 * @param y 被拖动元素新的纵坐标
				 */
				next: ({ x, y }) => {
					this.dragging.style.left = x + "px";
					this.dragging.style.top = y + "px";

					// 索引必须取整为了后面的对比
					const i = Math.round((y - yOffset) / span);
					if (i <= 0) {
						insertInto(0);
					} else if (i < cards.length) {
						insertInto(i);
					} else {
						insertInto(cards.length - 1);
					}
				},
				complete: () => {
					this.dragging = null;
					cards[holderIndex] = item;
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
@import "../../css/Imports";

.card {
	margin: 20px 0;
}

.holder {
	composes: card;
	height: 2.6rem;
	border: solid 3px #94f2ca;
}

.toolbar {
	text-align: right;
}
</style>
