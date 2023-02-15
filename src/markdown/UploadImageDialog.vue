<template>
	<KxBaseDialog title='插入图片' :class='$style.dialog'>
		<FileDrop
			v-if='file === undefined'
			:class='$style.image'
			accept='image/*'
			@select='handleChange'
		/>
		<template v-else>
			<img
				:class='$style.image'
				alt='预览'
				:src='objectUrl'
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
				<dd>{{ dataSizeIEC.n2sDivision(file.size) }}</dd>
			</dl>
		</template>

		<Size2DInput
			v-model:width='view.width'
			v-model:height='view.height'
			:aspect-ratio='rawSize.width / rawSize.height'
			:class='$style.sizeInput'
		/>

		<progress
			:value='progress'
			max='1'
			style='width: 100%'
		/>

		<KxDialogButtons
			:acceptable='!!file'
			@accept='upload'
			@cancel='dialog.close'
		/>
	</KxBaseDialog>
</template>

<script setup lang='ts'>
import { onBeforeUnmount, reactive, shallowRef } from "vue";
import { useObjectUrl } from "@vueuse/core";
import { dataSizeIEC } from "@kaciras/utilities/browser";
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
const progress = shallowRef<number | undefined>(0);
const objectUrl = useObjectUrl(file);

const controller = new AbortController();

onBeforeUnmount(() => controller.abort());

const rawSize = reactive<Resolution>({
	width: NaN,
	height: NaN,
});

const view = reactive<Resolution>({
	width: NaN,
	height: NaN,
});

function handleChange([selected]: File[]) {
	file.value = selected;
}

function handleLoad(event: Event) {
	const el = event.target as HTMLImageElement;
	view.width = rawSize.width = el.naturalWidth;
	view.height = rawSize.height = el.naturalHeight;
}

async function upload() {
	const { signal } = controller;
	const { width, height } = view;

	progress.value = undefined;
	const url = await api
		.configure({ signal })
		.media
		.uploadImage(file.value);

	dialog.confirm({
		vw: width,
		vh: height,
		url,
		name: file.value!.name,
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
