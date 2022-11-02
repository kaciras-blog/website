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
				<dd>
					{{ rawSize.width }} x {{ rawSize.height }}
				</dd>

				<dt>文件大小</dt>
				<dd>{{ formatSize(file.size) }}</dd>
			</dl>
		</template>

		<Size2DInput
			v-model:width='viewSize.width'
			v-model:height='viewSize.height'
			:aspect-ratio='rawSize.width / rawSize.height'
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
import { reactive, shallowRef } from "vue";
import { useObjectUrl } from "@vueuse/core";
import { formatSize } from "@kaciras/utilities/format";
import { KxBaseDialog, KxDialogButtons, Resolution, useDialog } from "@kaciras-blog/uikit";
import api from "@/api/index";
import FileDrop from "./FileDrop.vue";
import Size2DInput from "./Size2DInput.vue";

interface UploadImageDialogProps {
	initFile?: File;
}

const props = defineProps<UploadImageDialogProps>();

const dialog = useDialog();

const file = shallowRef<File | undefined>(props.initFile);
const url = useObjectUrl(file);
const progress = shallowRef(0);

const rawSize = reactive<Resolution>({
	width: NaN,
	height: NaN,
});

const viewSize = reactive<Resolution>({
	width: NaN,
	height: NaN,
});

function handleChange([selected]: File[]) {
	file.value = selected;
}

function handleLoad(event: Event) {
	const el = event.target as HTMLImageElement;
	viewSize.width = rawSize.width = el.naturalWidth;
	viewSize.height = rawSize.height = el.naturalHeight;
}

async function upload() {
	const { width, height } = viewSize;
	progress.value = NaN;

	dialog.confirm({
		name: file.value!.name,
		vw: width,
		vh: height,
		url: await api.media.uploadImage(file.value),
	});
}
</script>

<style module lang='less'>
@width: 352px;

.dialog {
	width: @width + 40px;
}

.image {
	width: @width;
	height: (@width / 16 * 9);
}

.sizeInput {
	margin: 1rem 0;
}
</style>
