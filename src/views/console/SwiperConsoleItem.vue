<template>
	<section>
		<div class="summary">
			<h2 class="compact" @click="item.open = !item.open">{{item.slide.name}}</h2>

			<kx-button
				class="icon handler"
				title="拖动调整次序"
				@mousedown.stop="dragStart">
				<i class="fas fa-arrows-alt"></i>
			</kx-button>

			<kx-button
				class="icon dangerous"
				title="删除"
				@click="remove">
				<i class="fas fa-trash"></i>
			</kx-button>
		</div>

		<div v-show="item.open" class="details">
			<div class="picture"
				 @click="setPicture">
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
</template>

<script>
import api from "../../api";

export default {
	name: "SwiperConsoleItem",
	props: {
		item: Object,
		required: true,
	},
	methods: {
		setPicture () {
			api.misc.uploadImageFile().then(name => this.item.slide.picture = name);
		},
		remove () {
			this.$emit("remove", this.item.tid);
		},
		dragStart (event) {
			if (!event.touches && event.button !== 0) {
				return; // 鼠标右键不拖动
			}
			this.$emit("drag-started", { event, item: this.item });
		},
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImport";

@main-color: #2f8bff;

.summary {
	display: flex;
	line-height: 2.6rem;
	color: white;
	background-color: @main-color;
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
	border: solid 1px @main-color;
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
		.full-percent;
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
	background: #cfccbe;
}

.delete {
	background: #f56c6e;
}
</style>
