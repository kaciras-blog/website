<template>
	<KxBaseDialog title="友链信息">
		<div :class="$style.wrapper">
			<img
				:src="value.background"
				title="设置背景"
				:class="$style.background"
				alt="background"
				@click="uploadBackground"
			>
			<img
				:src="value.favicon ?? DEFAULT_AVATAR"
				title="设置图标"
				alt="favicon"
				:class="$style.favicon"
				@click.stop="uploadFavicon"
			>
		</div>

		<MaterialTextInput
			v-model="value.url"
			label="URL"
			name="url"
			placeholder="http://example.com/index"
		/>
		<MaterialTextInput
			v-model="value.name"
			name="name"
			label="名字（16字以内）"
		/>
		<MaterialTextInput
			v-model="value.friendPage"
			name="friendPage"
			label="对方的友链页（可选，用于检查互友）"
		/>

		<KxDialogButtons
			:on-accept="confirm"
			:on-cancel="dialog.close"
		/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { reactive, toRaw } from "vue";
import { openFile, useDialog, MaterialTextInput, KxDialogButtons, KxBaseDialog } from "@kaciras-blog/uikit";
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
const value = reactive({ ...toRaw(props) });

async function uploadBackground() {
	value.background = await cropAndUploadImage(16 / 9);
}

async function uploadFavicon() {
	value.favicon = await cropAndUploadImage(1);
}

async function cropAndUploadImage(aspectRatio: number) {
	let image:Blob = await openFile("image/*");
	const cropping = await dialog.cropImage({ image, aspectRatio });
	if (cropping.isConfirm) {
		image = cropping.data;
	}
	return api.misc.uploadImage(image);
}

// 烦人的空字符串与 null 的问题
function confirm() {
	if (!value.friendPage) {
		delete value.friendPage;
	}
	dialog.confirm(toRaw(value));
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
