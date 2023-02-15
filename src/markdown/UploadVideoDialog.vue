<template>
	<KxBaseDialog title='插入视频'>
		<form :class='$style.form' @keyup.enter='upload'>
			<div :class='$style.fileList'>
				<div
					v-for='(video, i) of files'
					:key='video.file.name'
					:class='$style.file'
				>
					<video
						:class='$style.preview'
						:src='video.url'
						@loadedmetadata='e => handleVideoLoad(e, video)'
					/>
					<div :class='$style.nameLine'>
						<span class='ellipsis-line'>
							{{ video.file.name }}
						</span>

						<KxButton
							type='icon'
							color='dangerous'
							@click='remove(i)'
						>
							<CloseIcon/>
						</KxButton>
					</div>
					<div>
						{{ video.width }} x {{ video.height }},
						{{ video.time.toFixed(2) }}s,
						{{ dataSizeIEC.n2sDivision(video.file.size) }}
					</div>
					<div>
						<KxCheckBox
							:model-value='video.isMain'
							@update:model-value='changeMain(video)'
						>
							源文件
						</KxCheckBox>

						<KxSelect
							v-model='video.codec'
							title='编码'
							:class='$style.select'
						>
							<option value='AVC'>AVC</option>
							<option value='HEVC'>HEVC</option>
							<option value='AV1'>AV1</option>
						</KxSelect>
					</div>
				</div>
			</div>

			<div :class='$style.right'>
				<FileDrop
					:class='$style.fileDrop'
					accept='video/*'
					:multiple='true'
					@select='addFiles'
				/>

				<Size2DInput
					v-model:width='data.vw'
					v-model:height='data.vh'
					:aspect-ratio='data.aspectRatio'
				/>

				<KxRadioBoxGroup
					v-model='data.isVideo'
					name='isVideo'
					:class='$style.field'
				>
					<KxRadioBox :value='false'>
						作为 GIF 动图
					</KxRadioBox>
					<KxRadioBox :value='true'>
						作为视频
					</KxRadioBox>
				</KxRadioBoxGroup>


				<div v-if='data.isVideo' :class='$style.field'>
					<input
						id='video_poster'
						placeholder='视频封面'
						v-model='data.poster'
						name='poster'
						:class='$style.text_box'
					>
					<KxTaskButton
						:class='$style.button'
						type='outline'
						:on-click='uploadPoster'
					>
						上传
					</KxTaskButton>
				</div>

				<div v-else :class='$style.field'>
					<input
						id='video_alt'
						placeholder='说明文字'
						name='alt'
						:class='$style.text_box'
						:value='data.label'
						@input='inputLabel'
					>
				</div>

				<progress
					:value='progress'
					:max='files.length'
				/>

				<KxDialogButtons
					:class='$style.actions'
					:acceptable='files.length > 0'
					@accept='upload'
					@cancel='dialog.close'
				/>
			</div>
		</form>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import type { VideoStatement } from "./MediaTools.vue";
import { onUnmounted, reactive, ref, toRaw } from "vue";
import { dataSizeIEC } from "@kaciras/utilities/browser";
import {
	KxBaseDialog,
	KxButton,
	KxCheckBox,
	KxDialogButtons,
	KxRadioBox,
	KxRadioBoxGroup,
	KxSelect,
	KxTaskButton,
	useDialog,
} from "@kaciras-blog/uikit";
import api, { VariantSaveParams } from "@/api";
import CloseIcon from "@kaciras-blog/uikit/src/assets/icon-close.svg?sfc";
import FileDrop from "./FileDrop.vue";
import Size2DInput from "./Size2DInput.vue";

interface UploadVideoDialogProps {
	initFiles: File[];
}

interface LocalData extends Omit<VideoStatement, "src"> {
	autoLabel: boolean;
	aspectRatio: number;
}

/*
 * 目前没有原生的 API 能获取视频的编码，而且三方库都太大了，
 * 只能手动选择，万一选错了就 GG。
 */

interface VideoDetail {
	file: File;
	url: string;
	codec?: string;
	isMain: boolean;

	width?: number;
	height?: number;
	time?: number;
}

const props = defineProps<UploadVideoDialogProps>();

const dialog = useDialog();

const files = ref<VideoDetail[]>([]);
const progress = ref(0);

addFiles(props.initFiles);

const data = reactive<LocalData>({
	isVideo: false,
	poster: "",
	label: "",
	vw: NaN,
	vh: NaN,
	aspectRatio: NaN,
	autoLabel: true,
});

async function upload() {
	const list = toRaw(files.value);
	const i = list.findIndex(v => v.isMain);

	const variant = await doUpload(list[i]);
	for (const info of list) {
		if (info.isMain) {
			continue;
		}
		progress.value++;
		await doUpload(info, variant);
	}

	data.src = variant;
	dialog.confirm(data as VideoStatement);
}

// codec 特殊处理下
function doUpload(info: VideoDetail, variant?: string) {
	const { file, codec } = info;
	const params: VariantSaveParams = {
		variant,
	};
	if (codec !== "AVC") {
		params.codec = codec;
	}
	return api.media.uploadVideo(file, params);
}

// 用户的输入给设个标识，关闭 label 的自动填充
function inputLabel(event: Event) {
	data.autoLabel = false;
	data.label = (event.target as HTMLInputElement).value;
}

async function addFiles(selected: File[]) {
	for (const file of selected) {
		files.value.push({
			width: NaN,
			height: NaN,
			time: NaN,

			file,
			url: URL.createObjectURL(file),
			codec: "AVC",
			isMain: files.value.length === 0,
		});
	}
}

function handleVideoLoad(event: Event, video: VideoDetail) {
	const el = event.target as HTMLVideoElement;
	video.time = el.duration;
	video.width = el.videoWidth;
	video.height = el.videoHeight;

	// 删完再选 length===1，初始化 vw===NaN。
	if (files.value.length === 1 || !data.vw) {
		data.vw = el.videoWidth;
		data.vh = el.videoHeight;
		data.aspectRatio = data.vw / data.vh;
	}
}

function remove(index: number) {
	URL.revokeObjectURL(files.value.splice(index, 1)[0].url);
}

function changeMain(info: VideoDetail) {
	files.value.forEach(v => v.isMain = false);
	info.isMain = true;
}

async function uploadPoster() {
	data.poster = await api.media.uploadImageFile();
}

onUnmounted(() => files.value.forEach(v => URL.revokeObjectURL(v.url)));
</script>

<style module lang="less">
@margin: 14px;

.form {
	display: flex;
	gap: 2rem;
}

.fileList {
	display: flex;
	flex-direction: column;
	gap: 10px;

	width: 450px;
	height: 340px;
	overflow: scroll;
}

.file {
	display: grid;
	grid-template-areas: "preview header" "preview attrs" "preview name";
	grid-template-columns: 160px 280px;
	grid-template-rows: auto auto 1fr;
	gap: 10px;

	&:hover {
		background: #f2f2f2;
	}
}

.preview {
	grid-area: preview;
	max-width: 160px;
	max-height: 120px;
	justify-self: center;
}

.nameLine {
	display: flex;
	align-items: center;
}

.select {
	display: inline-block;
	margin-left: auto;
}

.right {
	display: flex;
	flex-direction: column;
	gap: 14px;
	width: 23rem;
}

.fileDrop {
	flex: 1;
}

.field {
	display: flex;

	// 单选按钮高度不够，需要居中一下
	align-items: center;

	& > :global(.kx-check-box) {
		margin-right: @margin;
	}
}

.label {
	display: block;
}

.text_box {
	flex: 1;
}

.button {
	margin-left: @margin;

	// 跟按钮大小一致，避免右边没按钮时高度改变
	height: calc(2rem + 1.6px);
}

.actions {
	margin: 0;
}
</style>
