<template>
	<KxButton type='icon' title='插入图片' @click='addImage()'>
		<ImageIcon/>
	</KxButton>
	<KxButton type='icon' title='插入视频' @click='addVideo'>
		<VideoIcon/>
	</KxButton>
	<KxButton type='icon' title='插入音频' @click='addAudio'>
		<MusicIcon/>
	</KxButton>
</template>

<script setup lang="ts">
import { KxButton, openFile, useDialog } from "@kaciras-blog/uikit";
import ImageIcon from "bootstrap-icons/icons/image-fill.svg?sfc";
import VideoIcon from "bootstrap-icons/icons/play-btn.svg?sfc";
import MusicIcon from "bootstrap-icons/icons/music-note-beamed.svg?sfc";
import api from "@/api";
import { basename } from "@/utils";
import UploadImageDialog from "./UploadImageDialog.vue";
import VideoVideoDialog from "./UploadVideoDialog.vue";
import { AddonContext, overwrite } from "./editor-addon";

interface TextStateGroupProps {
	ctx: AddonContext;
}

const props = defineProps<TextStateGroupProps>();
const dialog = useDialog();

// eslint-disable-next-line vue/no-setup-props-destructure
const context = props.ctx;

interface ImageUploadResult {
	vw: number;
	vh: number;
	name: string;
	url: string;
}

async function addImage(initFile?: File) {
	const result = await dialog
		.show<ImageUploadResult>(UploadImageDialog, { initFile });

	if (!result.isConfirm) {
		return;
	}
	const { vw, vh, name, url } = result.data;
	// 加上宽高便于确定占位图的尺寸，从 https://chanshiyu.com/#/post/41 学的。
	const res = `![${basename(name)}](${url}?vw=${vw}&vh=${vh})`;

	const [, selEnd] = context.selection;
	overwrite(context, selEnd, selEnd, res);
}

export interface VideoStatement {
	src: string;
	vw: number;
	vh: number;
	isVideo: boolean;
	poster: string;
	label: string;
}

async function addVideo(initFiles: File[] = []) {
	const result = await dialog
		.show<VideoStatement>(VideoVideoDialog, { initFiles });

	if (!result.isConfirm) {
		return;
	}
	const { src, vw, vh, label, poster, isVideo } = result.data;
	const text = isVideo
		? `@video[${poster}](${src})`
		: `@gif[${label}](${src}?vw=${vw}&vh=${vh})`;

	const [selEnd] = context.selection;
	overwrite(context, selEnd, selEnd, text);
}

async function addAudio(file?: File) {
	file ??= await openFile("audio/*");
	const res = await api.media.uploadAudio(file);
	const [selEnd] = context.selection;
	overwrite(context, selEnd, selEnd, `@audio[](${res})`);
}

defineExpose({ addImage, addVideo, addAudio });
</script>
