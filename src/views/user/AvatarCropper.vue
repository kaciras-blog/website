<template>
	<kx-base-dialog title="裁剪图片">
		<div :class="$style.wrapper">
			<croppa
				v-model="croppa"
				:width="300"
				:height="300"
				:show-remove-button="false"
				:prevent-white-space="true"
				:zoom-speed="10"
				:quality="1"
				@file-choose="onFileChoose"
			/>
			<div :class="$style.sight"></div>
		</div>
		<kx-standard-dialog-buttons @confirm="ok"/>
	</kx-base-dialog>
</template>

<script>
import api from "../../api";

export default {
	name: "AvatarCropper",
	props: {
		src: {},
	},
	data: () => ({
		croppa: {},
		mimetype: "",
	}),
	methods: {
		async ok () {
			const data = await this.croppa.promisedBlob(this.mimetype);
			const uri = await api.misc.uploadImage(data);
			this.$dialog.confirm(uri);
		},
		onFileChoose (e) { this.mimetype = e.type; },
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.wrapper {
	position: relative;
}

.sight {
	position: absolute;
	.full-vertex;
	overflow: hidden;
	pointer-events: none;

	&::after {
		content: "";
		box-sizing: content-box;

		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		width: 300px;
		height: 300px;
		border-radius: 50%;

		border: 300px solid rgba(0, 0, 0, 0.4);
	}
}

.footer {
	display: flex;
	justify-content: space-between;
	padding-left: 1rem;
	padding-right: 1rem;
}
</style>
