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

		<material-text-input
			v-model="value.url"
			label="URL"
			name="url"
			placeholder="http://example.com/index"
		/>

		<material-text-input
			v-model="value.name"
			name="name"
			label="名字（16字以内）"
		/>

		<material-text-input
			v-model="value.friendPage"
			name="friendPage"
			label="对方的友链页（可选，用于检查互友）"
		/>

		<kx-standard-dialog-buttons @confirm="confirm"/>
	</kx-base-dialog>
</template>

<script>
import { openFile } from "@kaciras-blog/uikit";
import api from "@/api";
import MaterialTextInput from "@/views/index/MaterialTextInput";

export default {
	name: "FriendInfoDialog",
	components: {
		MaterialTextInput,
	},
	props: {
		name: String,
		url: String,
		background: String,
		favicon: String,
		friendPage: {
			type: String,
			default: "",
		},
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

		// 烦人的空字符串与 null 的问题
		confirm() {
			const { value } = this;
			if (!value.friendPage) {
				delete value.friendPage;
			}
			this.$dialog.confirm(value);
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
</style>
