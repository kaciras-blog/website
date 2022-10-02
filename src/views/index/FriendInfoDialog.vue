<template>
	<KxBaseDialog title='友链信息'>
		<div :class='$style.wrapper'>
			<img
				:src='friend.background'
				title='设置背景'
				:class='$style.background'
				alt='background'
				@click='uploadBackground'
			>
			<img
				:src='friend.favicon ?? DEFAULT_AVATAR'
				title='设置图标'
				alt='favicon'
				:class='$style.favicon'
				@click.stop='uploadFavicon'
			>
		</div>

		<MaterialTextInput
			v-model='friend.url'
			label='URL'
			name='url'
			placeholder='http://example.com/index'
		/>
		<MaterialTextInput
			v-model='friend.name'
			name='name'
			label='名字（16字以内）'
		/>
		<MaterialTextInput
			v-model='friend.friendPage'
			name='friendPage'
			label='对方的友链页（可选，用于检查互友）'
		/>

		<KxDialogButtons
			:on-accept='confirm'
			:on-cancel='dialog.close'
		/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { reactive, toRaw } from "vue";
import {
	ImageCropper,
	KxBaseDialog,
	KxDialogButtons,
	MaterialTextInput,
	openFile,
	useDialog,
} from "@kaciras-blog/uikit";
import api from "@/api";
import { DEFAULT_AVATAR } from "@/common";

interface Friend_Copy {
	url: string;
	name: string;
	background: string;
	favicon?: string;
	friendPage?: string;
}

const props = defineProps<Friend_Copy>();

const dialog = useDialog();
const friend = reactive({ ...toRaw(props) });

async function uploadBackground() {
	friend.background = await selectImage(false, 16 / 9);
}

async function uploadFavicon() {
	friend.favicon = await selectImage(true, 1);
}

async function selectImage(circle: boolean, aspectRatio: number) {
	const image = await openFile("image/*");
	const cropping = await dialog.show(ImageCropper, {
		image, circle, aspectRatio,
	});
	return api.media.uploadImage(image, cropping.data);
}

// 烦人的空字符串与 null 的问题
function confirm() {
	if (!friend.friendPage) {
		delete friend.friendPage;
	}
	dialog.confirm(toRaw(friend));
}
</script>

<style module lang="less">
@import "../../css/imports";

@background-width: 320px;
@favicon-size: 100px;

.wrapper {
	position: relative;
	padding-bottom: (@favicon-size / 2);
	cursor: pointer;
}

.background {
	display: block;
	width: @background-width;
	height: (@background-width * 9 / 16);
}

.favicon {
	position: absolute;
	left: ((@background-width - @favicon-size) / 2);
	bottom: 0;
	.circle(@favicon-size);
	box-shadow: 0 0 10px rgba(0, 0, 0, .3)
}
</style>
