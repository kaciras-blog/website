<template>
	<div>
		<div class="btn-group" :class="$style.toolbar">
			<kx-button @click="createNew">添加轮播</kx-button>
			<kx-button @click="load">重新加载</kx-button>
			<kx-button class="primary" @click="submit">应用更改</kx-button>
		</div>

		<div ref="container">
			<template v-for="item of slides">
				<div
					v-if="item.hold"
					:class="[$style.hold, $style.slide]"
					:key="item.randomId">
				</div>
				<card-list-item
					v-else
					:key="item.randomId"
					:class="$style.slide"
					:item="item"
					@drag-started="drag"
					@remove="remove"
				/>
			</template>
		</div>

		<!-- 拖动中的元素 -->
		<card-list-item
			v-if="dragging"
			:style="dragging.style"
			:item="dragging.item"
		/>
	</div>
</template>

<script>
import { observeMouseMove, elementPosition } from "@kaciras-blog/uikit/src/dragging";
import api from "@/api";
import { deleteOn, attachRandomId } from "@/utils";
import CardListItem from "./CardListItem";

const CARD_TEMPLATE = {
	picture: "/static/img/placeholder.png",
	name: "新的轮播页",
	link: "",
	description: "这是新添加的轮播页",
};

export default {
	name: "SlideConsole",
	components: {
		CardListItem,
	},
	data: () => ({
		slides: [],
		dragging: null,
	}),
	methods: {
		createNew() {
			this.slides.unshift(attachRandomId({ open: true, slide: CARD_TEMPLATE }));
		},
		async load() {
			const slides = await api.recommend.getCards();
			this.slides = slides.map(slide => attachRandomId({ slide, open: false }));
		},
		remove(id) {
			deleteOn(this.slides, s => s.randomId === id);
		},
		submit() {
			api.recommend.setCards(this.slides.map(item => item.slide))
				.then(() => this.$dialog.alertSuccess("修改成功"))
				.catch((e) => this.$dialog.alertError("修改失败", e.message));
		},
		drag({ event, item }) {
			const slides = this.slides;

			// 查找拖动页的索引，并折叠全部轮播页
			let holderIndex;
			for (let i = 0; i < slides.length; i++) {
				if (slides[i].randomId === item.randomId) {
					holderIndex = i;
				}
				slides[i].open = false;
			}

			// 等到全部折叠完了再计算高度。
			this.$nextTick(() => {
				/*
				 * 获取被拖动元素和容器元素的大小位置，计算出每个轮播标题栏的置换范围，在拖动时
				 * 不断检测被拖动元素位置与其他元素是否进入其他元素的置换范围，不断调整 slides
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
				slides[holderIndex] = { hold: true };

				function insertInto(i) {
					if (holderIndex === i) return;
					const hold = slides.splice(holderIndex, 1)[0];
					holderIndex = i;
					slides.splice(i, 0, hold);
				}

				/**
				 * 在拖动的过程中不断调用的函数。函数中修改被拖到元素的坐标，并
				 * 计算是否置换，置换取决于被拖动元素的纵坐标：
				 *     小于 slides 中第一个元素中心：插入到最前
				 *     大于第N个元素中心、小于第N+1个： 插入到N之后
				 *     大于最后一个元素中心：添加到最后
				 *
				 * @param x 被拖动元素新的横坐标
				 * @param y 被拖动元素新的纵坐标
				 */
				const next = ({ x, y }) => {
					this.dragging.style.left = x + "px";
					this.dragging.style.top = y + "px";

					// 索引必须取整为了后面的对比
					const i = Math.round((y - yOffset) / span);
					if (i <= 0) {
						insertInto(0);
					} else if (i < slides.length) {
						insertInto(i);
					} else {
						insertInto(slides.length - 1);
					}
				};

				const complete = () => {
					this.dragging = null;
					slides[holderIndex] = item;
				};

				observeMouseMove()
					.pipe(elementPosition(event, el))
					.subscribe({ next, complete });
			});
		},
	},
	beforeMount() {
		this.load();
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.slide {
	margin: 20px 0;
}

.hold {
	height: 2.6rem;
	border: solid 3px #85f2d0;
}

.toolbar {
	text-align: right;
}
</style>
