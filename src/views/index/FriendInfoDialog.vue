<template>
	<kx-base-dialog title="友链信息">

		<div :class="$style.wrapper">
			<img
				:src="value.background"
				title="设置背景"
				:class="$style.background"
				alt="background"
				@click="uploadBackground"
			>
			<img
				:src="value.favicon"
				title="设置图标"
				alt="favicon"
				:class="$style.favicon"
				@click.stop="uploadFavicon"
			>
		</div>

		<label :class="$style.material">
			<span :class="$style.material_label">URL</span>
			<input
				v-model="value.url"
				:class="$style.material_input"
				placeholder="http://example.com/index"
			>
		</label>

		<label :class="$style.material">
			<span :class="$style.material_label">标题（16字以内）</span>
			<input
				v-model="value.name"
				:class="$style.material_input"
			>
		</label>

		<kx-standard-dialog-buttons @confirm="$dialog.confirm(value)"/>
	</kx-base-dialog>
</template>

<script>
import { openFile } from "@kaciras-blog/uikit";
import api from "@/api";

export default {
	name: "FriendInfoDialog",
	props: {
		name: String,
		url: String,
		background: String,
		favicon: String,
	},
	// 这写法真你🐎丑陋，希望Vue3能改改
	data() {
		return { value: Object.assign({}, this.$props) };
	},
	methods: {
		async uploadBackground() {
			this.value.background = await this.cropAndUploadImage(16 / 9);
		},

		async uploadFavicon() {
			this.value.favicon = await this.cropAndUploadImage(1);
		},

		async cropAndUploadImage(aspectRatio) {
			let image = await openFile("image/*");
			const cropping = await this.$dialog.cropImage({ image, aspectRatio });
			if (cropping.isConfirm) {
				image = cropping.data;
			}
			return api.misc.uploadImage(image);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

@background-width: 320px;
@favicon-size: 100px;

.wrapper {
	position: relative;
	padding-bottom: @favicon-size / 2;
	cursor: pointer;
}

.background {
	width: @background-width;
	height: @background-width * 9 / 16;
}

.favicon {
	position: absolute;
	left: (@background-width - @favicon-size) / 2;
	bottom: 0;
	.circle(@favicon-size);
	box-shadow: 0 0 10px rgba(0, 0, 0, .3)
}

// =====================================================

.material {
	display: block;
	margin: 16px 8px 8px 8px;

	&:focus-within > .material_label {
		color: #1672f9;
	}
}

.material_label {
	display: block;
	transition: all .2s ease;
}

.material_input {
	display: block;
	width: 100%;

	border-radius: 0;
	border: none;
	border-bottom: 2px solid #d0d0d0;
	padding: 6px 0;

	box-shadow: none !important;
	transition: all .2s ease;

	&:focus {
		border-bottom-color: #1175ff;
	}
}
</style>
