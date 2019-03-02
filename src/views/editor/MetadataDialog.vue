<template>
	<kx-base-dialog @close-button-clicked="ok">
		<template #title>
			<h3 :class="$style.compact">编辑描述信息</h3>
		</template>

		<div :class="$style.content">
			<img :class="$style.cover"
				 :src="cover"
				 alt="封面"
				 @click="changeCover"/>

			<input title="标题"
				   :class="$style.title"
				   v-model="title"
				   placeholder="标题最多50个字"/>

			<textarea
				:class="$style.summary"
				class="input"
				v-model="summary"
				placeholder="摘要，别写太多">
			</textarea>

			<input title="关键字"
				   :class="$style.keywords"
				   v-model="keywords"
				   placeholder="关键字,空格隔开"/>
		</div>

		<template v-slot:footer>
			<div :class="$style.footer" class="btn-group">
				<kx-button @click="cancel">取消</kx-button>
				<kx-button class="primary" @click="ok">确定</kx-button>
			</div>
		</template>
	</kx-base-dialog>
</template>

<script>
import api from "../../api";

export default {
	name: "MetadataDialog",
	props: {
		metadata: Object,
	},
	data () {
		return this.metadata;
	},
	methods: {
		ok () {
			this.$dialog.close(this.$data);
		},
		cancel () {
			this.$dialog.close();
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
	width: 12rem;
	height: 10rem;
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

.footer {
	text-align: right;
	padding-right: 1rem;
}
</style>
