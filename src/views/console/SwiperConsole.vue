<template>
	<div>
		<div class="buttons">
			<button @click="createNew">添加</button>
			<button @click="submit">确定</button>
		</div>

		<section v-for="item of slides"
				 :key="item.tid"
				 class="slide">

			<div class="summary">
				<h2 class="compact" @click="item.open = !item.open">{{item.slide.name}}</h2>
				<div class="handler" @click="drag(item)"><i class="fas fa-arrows-alt"></i></div>
				<div class="delete" @click="remove(item)"><i class="fas fa-trash"></i></div>
			</div>

			<div v-show="item.open" class="details">
				<div class="picture"
					 @click="setPicture(item.slide)">
					<img :src="item.slide.picture" alt="轮播图片"/>
					<span class="tip">点击更换图片</span>
				</div>
				<label>
					<span class="minor-text">标题</span>
					<input v-model="item.slide.name"/>
				</label>
				<label>
					<span class="minor-text">URL（相对路径将使用页面内路由）</span>
					<input v-model="item.slide.link"/>
				</label>
				<label>
					<span class="minor-text">描述</span>
					<textarea class="input" v-model="item.slide.description"></textarea>
				</label>
			</div>
		</section>
	</div>
</template>

<script>
import api from "../../apis";
import {deleteOn} from "../../utils";

export default {
	name: "SwiperConsole",
	data: () => ({
		slides: [],
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
		setPicture(slide) {
			api.misc.uploadImageFile().then(name => slide.picture = name);
		},
		remove(item) {
			deleteOn(this.slides, it => it.tid === item.tid);
		},
		submit() {
			api.recommend.swiper.set(this.slides.map(item => item.slide))
				.then(() => this.$dialog.messageBox("修改轮播", "修改成功"))
				.catch(() => alert("失败了"));
		},
		drag(item, event) {
			this.slides.forEach(s => s.open = false);
			item.open = false;
			event.dataTransfer.setData("Text", item);
		},
		dragOver(item) {
			this.slides.forEach(s => s.open = false);

		},
	},
	async beforeMount() {
		api.recommend.swiper.get()
			.then(slides => slides.forEach(slide => this.slides.push({ slide, open: false, tid: Math.random() })));
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.slide {
	margin: 1rem 0;
}

.summary {
	display: flex;
	line-height: 2.6rem;
	color: white;
	background-color: #51a5ff;
	cursor: pointer;

	& > h2 {
		flex: 1;
		padding-left: 1rem;
	}

	& > div {
		float: right;
		font-size: 1.5rem;
		text-align: center;
		width: 3rem;
	}
}

.details {
	border: solid 1px #6abdff;
	border-top-width: 0;
	padding: 1.5rem;

	display: grid;
	grid-gap: 1rem;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto 1fr;

	input {
		width: 100%;
		margin-top: .5rem;
	}

	textarea {
		width: 100%;
		margin-top: .5rem;
		height: calc(100% - 1.5rem);
	}
}

.picture {
	position: relative;
	overflow: hidden;
	grid-row: ~"1/4";
	width: 28rem;
	height: 16rem;
	cursor: pointer;

	& > img {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	&:hover > .tip {
		top: 0;
	}
}

.tip {
	transition: all ease .2s;

	position: absolute;
	height: 2.5rem;
	line-height: 2.5rem;
	top: -2.5rem;
	left: 0;
	right: 0;

	text-align: center;
	color: white;
	background: rgba(0, 0, 0, .5);
}

.handler {
	cursor: move;
	background: #b4aa9e;
}

.delete {
	background: #f5808d;
}
</style>
