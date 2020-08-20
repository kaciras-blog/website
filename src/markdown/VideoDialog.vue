<template>
	<kx-base-dialog title="插入视频">
		<form :class="$style.form" @keyup.enter="enterKey">

			<label for="video_url">视频URL（必需）</label>
			<div :class="$style.field">
				<input
					id="video_url"
					v-model="src"
					name="src"
					:class="$style.text_box"
				>
				<kx-task-button
					:class="$style.button"
					:on-click="uploadVideo"
				>
					上传
				</kx-task-button>
			</div>

			<kx-radio-box-group
				v-model="isVideo"
				name="isVideo"
				:class="$style.field"
			>
				<kx-radio-box :value="false">作为GIF动图</kx-radio-box>
				<kx-radio-box :value="true">作为视频</kx-radio-box>
			</kx-radio-box-group>

			<template v-if="isVideo">
				<label for="video_poster">视频封面</label>
				<div :class="$style.field">
					<input
						id="video_poster"
						v-model="poster"
						name="poster"
						:class="$style.text_box"
					>
					<kx-task-button
						:class="$style.button"
						:on-click="uploadPoster"
					>
						上传
					</kx-task-button>
				</div>
			</template>
			<template v-else>
				<label for="video_alt">说明文字</label>
				<div :class="$style.field">
					<input
						id="video_alt"
						v-model="label"
						name="alt"
						:class="$style.text_box"
					>
				</div>
			</template>
		</form>

		<kx-standard-dialog-buttons
			:acceptable="src.length > 0"
			@confirm="$dialog.confirm($data)"
		/>
	</kx-base-dialog>
</template>

<script>
import { openFile } from "@kaciras-blog/uikit";
import api from "@/api";
import { basename } from "@/utils";

export default {
	name: "VideoDialog",
	data: () => ({
		src: "",
		isVideo: false,
		label: "",
		poster: "",
	}),
	methods: {
		async uploadVideo() {
			const file = await openFile("video/*");
			this.src = await api.misc.uploadVideo(file);
			this.label = basename(file.name);
		},
		async uploadPoster() {
			this.poster = await api.misc.uploadImageFile();
		},
		enterKey() {
			if (!this.src) {
				return;
			}
			this.$dialog.confirm(this.$data);
		},
	},
};
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
