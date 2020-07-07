<template>
	<kx-base-dialog title="插入视频">
		<form :class="$style.form" @keyup.enter="enterKey">

			<label for="video_url">视频URL（必需）</label>
			<div :class="$style.field">
				<input
					id="video_url"
					v-model="src"
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
						v-model="label"
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
import api from "@/api";

export default {
	name: "VideoDialog",
	data: () => ({
		src: "",
		isVideo: false,
		label: "",
	}),
	methods: {
		async uploadVideo() {
			this.src = await api.misc.uploadVideoFile();
		},
		async uploadPoster() {
			this.label = await api.misc.uploadImageFile();
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
@margin: 15px;

.form {
	width: 28em;
}

.field {
	display: flex;
	align-items: center;

	// 这两个针对 fieldset
	border: none;
	padding: 0;

	// margin-top 针对上面的 label
	margin-top: 4px;
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
