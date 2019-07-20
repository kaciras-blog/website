<template>
	<kx-base-dialog title="裁剪图片">
		<div :class="$style.wrapper">
			<croppa
				v-model="cropper"
				:width="width"
				:height="height"
				:initial-image="initialImage"
				:show-remove-button="false"
				:prevent-white-space="true"
				:zoom-speed="10"
				:quality="1"
				@file-choose="onFileChoose"
			/>
			<div v-if="circle" :class="$style.sight"></div>
		</div>
		<kx-standard-dialog-buttons @confirm="ok"/>
	</kx-base-dialog>
</template>

<script>
export default {
	name: "ImageCropper",
	props: {
		width: {
			type: Number,
			required: true,
		},
		height: {
			type: Number,
			required: true,
		},
		circle: {
			type: Boolean,
			default: false,
		},
		initialImage: {},
	},
	data: () => ({
		cropper: {},
		mimeType: "",
	}),
	methods: {
		async ok() {
			this.$dialog.confirm(await this.cropper.promisedBlob(this.mimeType));
		},
		onFileChoose(e) { this.mimeType = e.type; },
	},
};
</script>

<style module lang="less">
@import "../css/Imports";

.wrapper {
	position: relative;
	border: solid 1px rgba(0, 0, 0, 0.4);
}

.sight {
	composes: full-vertex from global;
	overflow: hidden;
	pointer-events: none;

	&::after {
		content: "";
		box-sizing: content-box;

		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		width: 100%;
		height: 100%;
		border-radius: 50%;

		border: 9999px solid rgba(0, 0, 0, 0.4);
	}
}
</style>
