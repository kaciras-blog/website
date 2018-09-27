<template>
	<div>
		<div class="toolbar btn-group">
			<kx-button @click="createNew">添加轮播</kx-button>
			<kx-button class="primary" @click="submit">应用更改</kx-button>
		</div>

		<div ref="container">
			<template v-for="item of slides">
				<swiper-console-item
					v-if="!item.hold"
					:key="item.tid"
					class="slide"
					:item="item"
					@drag-started="drag"
					@remove="remove"/>
				<div v-else :key="item.tid" class="hold slide"></div>
			</template>
		</div>

		<swiper-console-item
			v-if="dragging"
			ref="draggingComponent"
			:style="dragging.style"
			:item="dragging.item"/>
	</div>
</template>

<script>
import api from "../../apis";
import { deleteOn, drag } from "../../utils";
import SwiperConsoleItem from "./SwiperConsoleItem";

export default {
	name: "SwiperConsole",
	components: { SwiperConsoleItem },
	data: () => ({
		slides: [],
		dragging: null,
	}),
	methods: {
		createNew() {
			this.slides.unshift({
				open: true,
				tid: Math.random(),
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
				// 此处有BUG，不能使用Vue的.$el，否则getBoundingClientRect()返回值是错的。
				const el = document.querySelectorAll(".slide")[index];

				const container = this.$refs.container.getBoundingClientRect();
				const cTop = container.top;
				const rect = el.getBoundingClientRect();
				const span = rect.height / 2 + 1.5 * parseFloat(getComputedStyle(el).fontSize);

				slides[index] = { hold: true }; // 替换原轮播页为占位元素

				this.dragging = {
					item,
					tid: 0,
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

				drag(el, event.clientX, event.clientY, callback).then(() => {
					this.dragging = null;
					slides[index] = item;
				});
			});
		},
	},
	beforeMount() {
		api.recommend.swiper.get()
			.then(slides => slides.forEach(slide => this.slides.push({ slide, open: false, tid: Math.random() })));
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
	border: solid 2px #f7f646;
	box-shadow: 0 0 3px 3px #fffa38 inset;
}

.toolbar {
	text-align: right;
}
</style>
