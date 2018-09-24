<template>
	<kx-dialog @CloseButtonClicked="ok">
		<h2 class="compact" slot="title">编辑描述信息</h2>

		<div class="content">
			<img :src="cover"
				 alt="封面"
				 @click="changeCover"/>

			<input title="标题"
				   class="title"
				   v-model="title"
				   placeholder="标题最多50个字"/>

			<textarea
				class="summary input"
				v-model="summary"
				placeholder="摘要，别写太多">
			</textarea>

			<input title="关键字"
				   class="keywords"
				   v-model="keywords"
				   placeholder="关键字,空格隔开"/>
		</div>

		<div class="footer" slot="footer">
			<button @click="cancel">取消</button>
			<button @click="ok">确定</button>
		</div>
	</kx-dialog>
</template>

<script>
import api from "../apis";

export default {
	name: "MetadataDialog",
	props: {
		metadata: Object,
	},
	data() {
		return this.metadata;
	},
	methods: {
		ok() {
			this.$dialog.close(this.$data);
		},
		cancel() {
			this.$dialog.close();
		},
		changeCover() {
			api.misc.uploadImageFile().then(name => this.cover = name);
		},
	},
};
</script>

<style scoped>
.content {
	width: 680px;
	height: 200px;
	display: grid;
	grid-template-columns: repeat(11, 1fr);
	grid-template-rows: repeat(5, 1fr);
	grid-gap: .8em;
}

img {
	grid-area: 1/1/5/4;
	width: 100%;
	height: 100%;
	cursor: pointer;
}

.title {
	grid-area: 1/4/1/12;
}

.summary {
	grid-area: 2/4/5/12;
}

.keywords {
	grid-area: 5/1/5/12;
}

.footer {
	text-align: right;
	padding-right: 1rem;
}
</style>
