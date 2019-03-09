<template>
	<kx-base-dialog :closeIcon="true">
		<template v-slot:title>
			<h3>裁剪图片</h3>
		</template>

		<vueCropper
			ref="cropper"
			:img="src"
			:centerBox="true"
			:fixed="true"/>

		<kx-button @click="cancel">取消</kx-button>
		<kx-button class="primary" @click="ok">确定</kx-button>
	</kx-base-dialog>
</template>

<script>
import { VueCropper } from "vue-cropper";

export default {
	name: "AvatarCropper",
	components: {
		VueCropper,
	},
	props: {
		src: {
			type: [String, Blob],
			required: true,
		},
	},
	methods: {
		ok () {
			this.$refs.cropper.getCropBlob((data) => {
				console.log(data);
			});
		},
		cancel () {
			this.$dialog.close();
		},
	},
};
</script>

<style module lang="less">

</style>
