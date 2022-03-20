<template>
	<kx-button type="icon" title="插入图片" @click="addImage">
		<ImageIcon/>
	</kx-button>
	<kx-button type="icon" title="插入视频" @click="addVideo">
		<VideoIcon/>
	</kx-button>
	<kx-button type="icon" title="插入音频" @click="addAudio">
		<MusicIcon/>
	</kx-button>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<script setup lang="ts">
import { getImageResolution, getVideoResolution, openFile, useDialog, KxButton } from "@kaciras-blog/uikit";
import ImageIcon from "bootstrap-icons/icons/image-fill.svg?sfc";
import VideoIcon from "bootstrap-icons/icons/play-btn.svg?sfc";
import MusicIcon from "bootstrap-icons/icons/music-note-beamed.svg?sfc";
import api from "@/api";
import { basename } from "@/utils";
import VideoDialog from "./VideoDialog.vue";

interface ToolbarProps {
	content: string;
	selection: [number, number];
}

interface ToolbarEvents {
	(event: "overwrite", start: number, end: number, value: string): void;
}

const props = defineProps<ToolbarProps>();
const emit = defineEmits<ToolbarEvents>();

const dialog = useDialog();

async function addImage() {
	const file = await openFile("image/*");

	// 加上宽高便于确定占位图的尺寸，从 https://chanshiyu.com/#/post/41 学到的
	const { width, height } = await getImageResolution(file);
	const res = await api.misc.uploadImage(file) + `?vw=${width}&vh=${height}`;

	const [, selEnd] = props.selection;
	emit("overwrite", selEnd, selEnd, `![${basename(file.name)}](${res})`);
}

interface VDP_Copy {
	src: string;
	isVideo: boolean;
	poster: string;
	label: string;
	autoLabel: boolean;
}

async function addVideo() {
	const { src, label, poster, isVideo } = await dialog
		.show<VDP_Copy>(VideoDialog).confirmPromise;
	let text;

	if (isVideo) {
		text = `@video[${poster}](${src})`;
	} else {
		const { width, height } = await getVideoResolution(src);
		text = `@gif[${label}](${src}?vw=${width}&vh=${height})`;
	}

	const [selEnd] = props.selection;
	emit("overwrite", selEnd, selEnd, text);
}

async function addAudio() {
	const file = await openFile("audio/*");
	const res = await api.misc.uploadAudio(file);
	const [selEnd] = props.selection;
	emit("overwrite", selEnd, selEnd, `@audio[](${res})`);
}
</script>
