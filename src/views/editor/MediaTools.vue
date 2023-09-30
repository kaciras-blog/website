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
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import { selectFile } from "@kaciras/utilities/browser";
import { useAddonContext } from "@kaciras-blog/markdown-vue";
import ImageIcon from "bootstrap-icons/icons/image-fill.svg?sfc";
import VideoIcon from "bootstrap-icons/icons/play-btn.svg?sfc";
import MusicIcon from "bootstrap-icons/icons/music-note-beamed.svg?sfc";
import api from "@/api/index.ts";
import { basename } from "@/utils.ts";
import UploadImageDialog from "./UploadImageDialog.vue";
import VideoVideoDialog from "./UploadVideoDialog.vue";

const dialog = useDialog();
const context = useAddonContext();

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
	context.insertText(`![${basename(name)}](${url}?vw=${vw}&vh=${vh})`, false);
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

	context.insertText(text, true);
}

async function addAudio(file?: File) {
	file ??= (await selectFile("audio/*"))[0];
	const res = await api.media.uploadAudio(file);
	context.insertText(`@audio[](${res})`, true);
}

defineExpose({ addImage, addVideo, addAudio });
</script>
