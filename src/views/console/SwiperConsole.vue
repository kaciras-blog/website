<template>
	<div>
		<div class="toolbar btn-group">
			<kx-button @click="createNew">添加轮播</kx-button>
			<kx-button class="primary" @click="submit">应用更改</kx-button>
		</div>

		<div ref="container">
			<div v-for="item of slides"
				 v-if="item.hold"
				 class="hold slide"
				 :key="item.tid">
			</div>
			
			<swiper-console-item
				v-else
				:key="item.tid"
				class="slide"
				:item="item"
				@drag-started="drag"
				@remove="remove"/>
		</div>

		<swiper-console-item
			v-if="dragging"
			ref="draggingComponent"
			:style="dragging.style"
			:item="dragging.item"/>
	</div>
</template>

<script>
import api from "../../api";
import { deleteOn, drag } from "../../utils";
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
			let index;

			// 查找拖动页的索引，并折叠全部轮播页
			for (let i = 0; i < slen; i++) {
				if (slides[i].tid === item.tid) {
					index = i;
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
				 * 下面第一行Vue有BUG，不能使用组件的.$el，否则getBoundingClientRect()返回值是错的。
				 */
				const el = document.querySelectorAll(".slide")[index];
				const container = this.$refs.container.getBoundingClientRect();
				const cTop = container.top;
				const rect = el.getBoundingClientRect();
				const span = rect.height / 2 + 1.5 * parseFloat(getComputedStyle(el).fontSize);

				slides[index] = { hold: true }; // 替换原轮播页为占位元素

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
					if (index === i) return;
					const hold = slides.splice(index, 1)[0];
					index = i;
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
				const callback = (x, y) => {
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

				// 开始拖动，在结束时移除被拖动元素，并将被拖动元素的数据放到占位元素的位置
				drag(el, event.clientX, event.clientY, callback).then(() => {
					this.dragging = null;
					slides[index] = item;
				});
			});
		},
	},
	beforeMount() {
		api.recommend.swiper.get().then(slides => slides
			.forEach(slide => this.slides.push({ slide, open: false, tid: ++this.counter })));
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.slide {
	margin: 1.5rem 0;
}

.hold {
	height: 2.6rem;
	border: solid 2px #f8f078;
	box-shadow: 0 0 3px 3px #f8efa0 inset;
}

.toolbar {
	text-align: right;
}
</style>
