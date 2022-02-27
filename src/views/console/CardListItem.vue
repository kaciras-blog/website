<template>
	<section :class="{ [$style.expand]: expand }">
		<div :class="$style.summary">
			<h2 class="compact" @click="$emit('switch-expand')">
				{{ card.name }}
			</h2>

			<kx-button
				:class="$style.handler"
				type="icon"
				title="拖动调整次序"
				@mousedown.stop="dragStart"
			>
				<DownUpIcon/>
			</kx-button>

			<kx-button
				type="icon"
				title="删除"
				@click="$emit('remove', id)"
			>
				<TrashIcon/>
			</kx-button>
		</div>

		<form :class="$style.details">
			<div :class="$style.pictureWrapper" @click="setPicture">
				<img
					:src="card.picture"
					alt="封面"
					:class="$style.cover"
				/>
				<span :class="$style.tip">点击更换图片</span>
			</div>

			<label>
				<span class="minor-text">
					标题
				</span>
				<input
					v-model="card.name"
					name="name"
					:class="$style.inputBox"
				/>
			</label>

			<label>
				<span class="minor-text">
					URI，相对路径（以/开头的）将使用单页路由
				</span>
				<input
					v-model="card.link"
					name="link"
					:class="$style.inputBox"
				/>
			</label>

			<label>
				<span class="minor-text">
					描述（100字以内，太长不便于展示）
				</span>
				<textarea
					v-model="card.description"
					name="description"
					class="input"
					:class="$style.inputBox"
					placeholder="为卡片添加个描述吧"
				/>
			</label>
		</form>
	</section>
</template>

<script setup lang="ts">
import { KxButton } from "@kaciras-blog/uikit";
import DownUpIcon from "bootstrap-icons/icons/arrow-down-up.svg?sfc";
import TrashIcon from "bootstrap-icons/icons/trash.svg?sfc";
import api from "@/api";

interface CardListItemProps {
	id: number;
	expand: boolean;
	card: any;
}

const props = defineProps<CardListItemProps>();
const emit = defineEmits(["drag-start", "remove", "switch-expand"]);

function dragStart(event: TouchEvent & MouseEvent) {
	if (!event.touches && event.button !== 0) {
		return; // 鼠标右键不拖动
	}
	emit("drag-start", event);
}

// TODO: 是不是有问题这里
function setPicture() {
	api.misc.uploadImageFile().then(name => props.card.picture = name);
}
</script>

<style module lang="less">
@import "../../css/imports";

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

	display: none; // grid 在 .expand > .details
	grid-gap: 1rem;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto 1fr;
}

.expand {
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
	margin-top: 5px;
}

.pictureWrapper {
	position: relative;
	overflow: hidden;
	grid-row: ~"1/4";

	width: 24vw;
	height: 18vw;
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

.button {
	border-radius: 0;
}

.handler {
	composes: button;

	cursor: move;
	background: #e6e6e6;
}
</style>
