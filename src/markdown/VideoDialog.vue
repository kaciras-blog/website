<template>
	<kx-base-dialog title="插入视频">
		<form :class="$style.form" @keyup.enter="enterKey">
			<label for="video_url">
				视频URL（必需）
			</label>
			<div :class="$style.field">
				<input
					id="video_url"
					v-model="data.src"
					name="src"
					:class="$style.text_box"
				>
				<kx-task-button
					:class="$style.button"
					type="outline"
					:on-click="uploadVideo"
				>
					上传
				</kx-task-button>
			</div>

			<kx-radio-box-group
				v-model="data.isVideo"
				name="isVideo"
				:class="$style.field"
			>
				<kx-radio-box :value="false">
					作为 GIF 动图
				</kx-radio-box>
				<kx-radio-box :value="true">
					作为视频
				</kx-radio-box>
			</kx-radio-box-group>

			<template v-if="data.isVideo">
				<label for="video_poster">
					视频封面
				</label>
				<div :class="$style.field">
					<input
						id="video_poster"
						v-model="data.poster"
						name="poster"
						:class="$style.text_box"
					>
					<kx-task-button
						:class="$style.button"
						type="outline"
						:on-click="uploadPoster"
					>
						上传
					</kx-task-button>
				</div>
			</template>
			<template v-else>
				<label for="video_alt">
					说明文字
				</label>
				<div :class="$style.field">
					<input
						id="video_alt"
						name="alt"
						:class="$style.text_box"
						:value="data.label"
						@input="inputLabel"
					>
				</div>
			</template>
		</form>

		<kx-dialog-buttons
			:acceptable="data.src.length > 0"
			@cancel="dialog.close"
			@accept="dialog.confirm(data)"
		/>
	</kx-base-dialog>
</template>

<script setup lang="ts">
import {
	KxBaseDialog,
	KxDialogButtons,
	KxRadioBox,
	KxRadioBoxGroup,
	KxTaskButton,
	openFile,
	useDialog
} from "@kaciras-blog/uikit";
import api from "@/api";
import { basename } from "@/utils";
import { reactive } from "vue";

interface VideoDialogProps {
	src: string;
	isVideo: boolean;
	poster: string;
	label: string;
	autoLabel: boolean;
}

const dialog = useDialog();

const data = reactive<VideoDialogProps>({
	src: "",
	isVideo: false,
	poster: "",
	label: "",
	autoLabel: true,
});

function enterKey() {
	data.src && dialog.confirm(data);
}

// 用户的输入给设个标识，关闭 label 的自动填充
function inputLabel(event: Event) {
	data.autoLabel = false;
	data.label = (event.target as HTMLInputElement).value;
}

async function uploadVideo() {
	const file = await openFile("video/*");
	data.src = await api.misc.uploadVideo(file);
	if (data.autoLabel) {
		data.label = basename(file.name);
	}
}

async function uploadPoster() {
	data.poster = await api.misc.uploadImageFile();
}
</script>

<style module lang="less">
@margin: 14px;

.form {
	width: 28em;
}

.field {
	display: flex;

	// 单选按钮高度不够，需要居中一下
	align-items: center;

	// 跟按钮大小一致，避免右边没按钮时高度改变
	height: calc(2rem + 2px);

	// margin-top 针对上面的 label
	margin-top: 5px;
	margin-bottom: @margin;

	& > :global(.kx-check-box) {
		margin-right: @margin;
	}
}

.text_box {
	flex: 1;
}

.button {
	margin-left: @margin;
}
</style>
