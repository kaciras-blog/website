<template>
	<kx-base-dialog title="友链信息">

		<img
			:src="favicon"
			alt="网站图标"
			:class="$style.favicon"
			@click="uploadFavicon"
		>

		<label :class="$style.material">
			<span :class="$style.material_label">网址</span>
			<input
				v-model="url"
				:class="$style.material_input"
				placeholder="http://example.com/index"
			>
		</label>

		<label :class="$style.material">
			<span :class="$style.material_label">标题（16字以内）</span>
			<input
				v-model="name"
				:class="$style.material_input"
			>
		</label>

		<kx-standard-dialog-buttons @confirm="$dialog.confirm($data)"/>
	</kx-base-dialog>
</template>

<script>
import { openFile } from "kx-ui";
import api from "@/api";
import ImageCropper from "@/components/ImageCropper";

function blobToString(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

export default {
	name: "MakeFriendDialog",
	data: () => ({
		name: "",
		url: "",
		favicon: "/image/placeholder.png",
	}),
	methods: {
		async uploadFavicon() {
			let favicon = (await openFile(false, "image/*"))[0];
			const src = await blobToString(favicon);
			const cropping = await this.$dialog.show(ImageCropper, { width: 300, height: 300, initialImage: src });
			if (cropping.isConfirm) {
				favicon = cropping.data;
			}
			this.favicon = await api.misc.uploadImage(favicon);
		},
	},
};
</script>

<style module lang="less">
.material {
	display: block;
	margin: 16px 8px 8px 8px;

	&:focus-within > .material_label {
		color: #1672f9;
	}
}

.favicon {
	display: block;
	width: 160px;
	height: 160px;
	margin: 0 auto;
	cursor: pointer;
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
