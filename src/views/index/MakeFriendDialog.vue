<template>
	<kx-base-dialog title="友链信息">

		<div :class="$style.favicon_group">
			<img :src="favicon" alt="favicon" :class="$style.favicon">
			<div class="vertical-btn-group">
				<kx-button>上传</kx-button>
				<kx-button @click="fetchFavicon">自动采集</kx-button>
			</div>
		</div>

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
export default {
	name: "MakeFriendDialog",
	data: () => ({
		name: "",
		url: "",
		favicon: "/image/placeholder.png",
	}),
	methods: {
		async fetchFavicon() {
			if (!this.url) {
				alert("请先填写目标网址的地址");
			}
			const res = await fetch(this.url);
			this.favicon = await res.blob();
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

.favicon_group {
	display: flex;
}

.favicon {
	width: 150px;
	height: 150px;
	margin-right: 20px;
}

.material_label {
	display: block;
	color: #929292;
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
		border-bottom-color: #2f91ff;
	}
}
</style>
