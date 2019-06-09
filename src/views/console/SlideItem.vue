<template>
	<section :class="{ [$style.opened]: item.open }">
		<div :class="$style.summary">
			<h2 class="compact" @click="item.open = !item.open">{{item.slide.name}}</h2>

			<kx-button
				class="icon"
				:class="$style.handler"
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

		<div :class="$style.details">

			<div :class="$style.pictureWrapper" @click="setPicture">
				<img :src="item.slide.picture" alt="封面" :class="$style.cover"/>
				<span :class="$style.tip">点击更换图片</span>
			</div>
			<label>
				<span class="minor-text">标题</span>
				<input v-model="item.slide.name" :class="$style.inputBox"/>
			</label>
			<label>
				<span class="minor-text">URI，相对路径（以/开头的）将使用单页路由</span>
				<input v-model="item.slide.link" :class="$style.inputBox"/>
			</label>
			<label>
				<span class="minor-text">描述（100字以内，太长不便于展示）</span>
				<textarea
					v-model="item.slide.description"
					class="input"
					:class="$style.inputBox">
				</textarea>
			</label>
		</div>
	</section>
</template>

<script>
import api from "../../api";

export default {
	name: "SlideItem",
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		setPicture() {
			api.misc.uploadImageFile().then(name => this.item.slide.picture = name);
		},
		remove() {
			this.$emit("remove", this.item.randomId);
		},
		dragStart(event) {
			if (!event.touches && event.button !== 0) {
				return; // 鼠标右键不拖动
			}
			this.$emit("drag-started", { event, item: this.item });
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

@main-color: #4379e6;

.summary {
	display: flex;
	line-height: 2.6rem;
	color: white;
	background-color: @main-color;
	cursor: pointer;
	border-radius: 5px;
	overflow: hidden;

	& > h2 {
		flex: 1;
		padding-left: 1rem;
	}
}

.details {
	border: solid 1px @main-color;
	border-top-width: 0;
	padding: 1.5rem;

	display: none; // grid 在 .opened > .details
	grid-gap: 1rem;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto 1fr;
}

.opened {
	& > .summary {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	& > .details {
		display: grid;
	}
}

textarea.inputBox {
	height: calc(100% - 1.5rem);
}

.inputBox {
	width: 100%;
	margin-top: .5rem;
}

.pictureWrapper {
	position: relative;
	overflow: hidden;
	grid-row: ~"1/4";

	width: 27vw;
	height: 20vw;
	cursor: pointer;

	&:hover > .tip {
		top: 0;
	}
}

.cover {
	position: absolute;
	.size(100%);
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
	background: #e6e6e6;
}
</style>
