<template>
	<KxBaseDialog title='插入图片' :class='$style.dialog'>
		<FileDrop
			v-if='file === undefined'
			:class='$style.image'
			accept='image/*'
			@change='handleChange'
		/>
		<template v-else>
			<img
				:class='$style.image'
				alt='预览'
				:src='url'
				@load='handleLoad'
			>
			<dl class='grid-dl'>
				<dt>文件名</dt>
				<dd class='ellipsis-line' :title='file.name'>
					{{ file.name }}
				</dd>
				<dt>类型</dt>
				<dd>{{ file.type }}</dd>
				<dt>原始尺寸</dt>
				<dd>{{ viewSize.vw }} x {{ viewSize.vh }}</dd>
				<dt>文件大小</dt>
				<dd>{{ formatSize(file.size) }}</dd>
			</dl>
		</template>

		<Size2DInput
			v-model:width='viewSize.vw'
			v-model:height='viewSize.vh'
			:aspect-ratio='viewSize.aspectRatio'
			:class='$style.sizeInput'
		/>

		<progress :value='progress' max='1' style='width: 100%'/>

		<KxDialogButtons
			:acceptable='!!file'
			@accept='upload'
			@cancel='dialog.close'
		/>
	</KxBaseDialog>
</template>

<script setup lang='ts'>
import { onUnmounted, reactive, shallowRef } from "vue";
import { formatSize } from "@kaciras/utilities/format";
import { KxBaseDialog, KxDialogButtons, useDialog } from "@kaciras-blog/uikit";
import api from "@/api/index";
import FileDrop from "@/markdown/FileDrop.vue";
import Size2DInput from "@/markdown/Size2DInput.vue";

interface ViewSize2D {
	vw: number;
	vh: number;
	aspectRatio: number;
}

const dialog = useDialog();

const file = shallowRef<File>();
const url = shallowRef("");
const progress = shallowRef(0);

const viewSize = reactive<ViewSize2D>({
	vw: NaN,
	vh: NaN,
	aspectRatio: NaN,
});

onUnmounted(() => URL.revokeObjectURL(url.value));

function handleChange([selected]: File[]) {
	file.value = selected;
	url.value = URL.createObjectURL(selected);
}

function handleLoad(event: Event) {
	const el = event.target as HTMLImageElement;
	viewSize.vw = el.naturalWidth;
	viewSize.vh = el.naturalHeight;
	viewSize.aspectRatio = viewSize.vw / viewSize.vh;
}

async function upload() {
	const { vw, vh } = viewSize;
	progress.value = NaN;

	dialog.confirm({
		name: file.value!.name,
		vw, vh,
		url: await api.media.uploadImage(file.value),
	});
}
</script>

<style module lang='less'>
.dialog {
	width: 392px;
}

.image {
	width: 352px;
	height: 198px;
}

.sizeInput {
	margin: 1rem 0;
}
</style>
