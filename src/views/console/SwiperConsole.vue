<template>
	<main>
		<div class="btn-group" :class="$style.toolbar">
			<kx-button @click="createNew">添加轮播</kx-button>
			<kx-button @click="load">刷新</kx-button>
			<kx-button class="primary" @click="submit">应用更改</kx-button>
		</div>

		<div ref="container">
			<template v-for="item of slides">
				<div
					v-if="item.hold"
					:class="[$style.hold, $style.slide]"
					:key="item.tid">
				</div>
				<swiper-console-item
					v-else
					:key="item.tid"
					:class="$style.slide"
					:item="item"
					@drag-started="drag"
					@remove="remove"/>
			</template>
		</div>

		<!-- 拖动中的元素 -->
		<swiper-console-item
			v-if="dragging"
			:style="dragging.style"
			:item="dragging.item"/>
	</main>
</template>

<script>
import api from "../../api";
import { deleteOn } from "../../utils";
import { observeMouseMove, elementPosition } from "kx-ui/src/dragging";
import SwiperConsoleItem from "./SwiperConsoleItem";

export default {
	name: "SwiperConsole",
	components: { SwiperConsoleItem },
	data: () => ({
		slides: [],
		dragging: null,
		counter: 0, // 轮播自身不带ID，故这里给他们加一个。
	}),
	methods: {
		createNew() {
			this.slides.unshift({
				open: true,
				tid: ++this.counter,
				slide: {
					picture: "/image/noface.gif",
					name: "新的轮播页",
					link: "",
					description: "这是新添加的轮播页",
				},
			});
		},
		async load() {
			const slides = await api.recommend.swiper.get();
			this.slides = slides.map(slide => ({ slide, open: false, tid: ++this.counter }));
		},
		remove(id) {
			deleteOn(this.slides, s => s.tid === id);
		},
		submit() {
			api.recommend.swiper.set(this.slides.map(item => item.slide))
				.then(() => this.$dialog.messageBox("修改轮播", "修改成功"))
				.catch(() => alert("失败了"));
		},
		drag({ event, item }) {
			const slides = this.slides;
			const slen = slides.length;

			// 查找拖动页的索引，并折叠全部轮播页
			let holderIndex;
			for (let i = 0; i < slen; i++) {
				if (slides[i].tid === item.tid) {
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
				const cTop = container.top;
				const rect = el.getBoundingClientRect();
				const span = rect.height / 2 + 1.5 * parseFloat(getComputedStyle(el).fontSize);

				// 原轮播页的位置替换为占位元素
				slides[holderIndex] = { hold: true };

				// 被拖动元素放到单独的位置，并设为绝对定位。
				this.dragging = {
					item,
					tid: item.tid,
					style: {
						width: container.width + "px",
						position: "absolute",
						top: rect.top + "px",
						left: rect.left + "px",
					},
				};

				function moveTo(i) {
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
				const next = ({x, y}) => {
					this.dragging.style.left = x + "px";
					this.dragging.style.top = y + "px";

					const i = Math.round((y - cTop) / span);
					if (i <= 0) {
						moveTo(0);
					} else if (i >= slen * 2 - 1) {
						moveTo(slen - 1);
					} else {
						moveTo(Math.floor((i + 1) / 2));
					}
				};

				const complete = () => {
					this.dragging = null;
					slides[holderIndex] = item;
				};

				// TODO:开始拖动，在结束时移除被拖动元素，并将被拖动元素的数据放到占位元素的位置
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
	margin: 1.5rem 0;
}

.hold {
	height: 2.6rem;
	border: solid 3px #a2f5f8;
}

.toolbar {
	text-align: right;
}
</style>
