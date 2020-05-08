<template>
	<kx-base-dialog title="插入视频">
		<form :class="$style.form" @keyup.enter="enterKey">
			<div :class="$style.field">
				<input v-model="src" :class="$style.text_box">
				<kx-task-button :on-click="uploadVideo">上传视频</kx-task-button>
			</div>
			<div :class="$style.field">
				<input v-model="poster" :class="$style.text_box">
				<kx-task-button :on-click="uploadPoster">上传封面</kx-task-button>
			</div>
			<fieldset :class="$style.field">
				<kx-check-box v-model="autoplay">自动播放</kx-check-box>
				<kx-check-box v-model="loop">循环</kx-check-box>
				<kx-check-box v-model="muted">静音</kx-check-box>
			</fieldset>
		</form>
		<kx-standard-dialog-buttons @confirm="$dialog.confirm($data)"/>
	</kx-base-dialog>
</template>

<script>
import api from "@/api";

export default {
	name: "VideoDialog",
	data: () => ({
		src: null,
		poster: null,
		autoplay: false,
		loop: true,
		muted: true,
	}),
	methods: {
		async uploadVideo() {
			this.src = await api.misc.uploadVideoFile();
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
@margin: 15px;

.field {
	display: flex;
	align-items: center;

	// 这两个针对 fieldset
	border: none;
	padding: 0;

	margin-bottom: @margin;

	& > :global(.kx-check-box) {
		margin-right: @margin;
	}
}

.text_box {
	width: 24em;
	margin-right: @margin;
}
</style>
