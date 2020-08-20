<template>
	<kx-base-dialog title="编辑描述信息">
		<form :class="$style.content">
			<img
				:class="$style.cover"
				:src="local.cover"
				alt="封面"
				@click="changeCover"
			/>
			<input
				v-model="local.title"
				title="标题"
				:class="$style.title"
				placeholder="标题最多50个字"
			/>
			<textarea
				v-model="local.summary"
				:class="$style.summary"
				class="input"
				placeholder="100字以内，留空则使用文章前50字"
			/>
			<input
				v-model="local.keywords"
				title="关键字"
				:class="$style.keywords"
				placeholder="关键字,空格隔开"
			/>
		</form>
		<kx-standard-dialog-buttons @confirm="ok"/>
	</kx-base-dialog>
</template>

<script>
import api from "@/api";

export default {
	name: "MetadataDialog",
	inheritAttrs: false,
	props: {
		title: String,
		cover: String,
		keywords: String,
		summary: String,
	},
	data () {
		// metadata 是直接传的，复制一份防止影响原数据
		return { local: Object.assign({}, this.$props) };
	},
	methods: {
		ok () {
			this.$dialog.confirm(this.local);
		},
		async changeCover () {
			this.local.cover = await api.misc.uploadImageFile();
		},
	},
};
</script>

<style module lang="less">
.content {
	width: 680px;
	display: grid;
	grid-template-areas: "cover title"
						 "cover summary"
						 "keywords keywords";
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr auto;
	grid-gap: 1rem;
}

.cover {
	grid-area: cover;
	width: 14rem;
	height: 10.5rem;
	cursor: pointer;
}

.title {
	grid-area: title;
}

.summary {
	grid-area: summary;
}

.keywords {
	grid-area: keywords;
}
</style>
