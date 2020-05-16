<template>
	<kx-base-dialog title="编辑描述信息">
		<div :class="$style.content">
			<img
				:class="$style.cover"
				:src="cover"
				alt="封面"
				@click="changeCover"
			/>
			<input
				v-model="title"
				title="标题"
				:class="$style.title"
				placeholder="标题最多50个字"
			/>
			<textarea
				v-model="summary"
				:class="$style.summary"
				class="input"
				placeholder="摘要，别写太多"
			/>
			<input
				v-model="keywords"
				title="关键字"
				:class="$style.keywords"
				placeholder="关键字,空格隔开"
			/>
		</div>
		<kx-standard-dialog-buttons @confirm="ok"/>
	</kx-base-dialog>
</template>

<script>
import api from "@/api";

export default {
	name: "MetadataDialog",
	props: {
		metadata: Object,
	},
	data () {
		// metadata 是直接传的，复制一份防止影响原数据
		return Object.assign({}, this.metadata);
	},
	methods: {
		ok () {
			this.$dialog.confirm(this.$data);
		},
		changeCover () {
			api.misc.uploadImageFile().then(name => this.cover = name);
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
