<template>
	<kx-base-dialog title="描述信息">
		<form :class="$style.content">
			<img
				:class="$style.cover"
				:src="local.cover ?? DEFAULT_COVER"
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
		<kx-dialog-buttons @accept="ok" @cancel="$dialog.close"/>
	</kx-base-dialog>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { reactive, toRaw } from "vue";
import { useDialog, KxDialogButtons, KxBaseDialog } from "@kaciras-blog/uikit";
import api from "@/api";
import { DEFAULT_COVER } from "@/blog-plugin";

interface ArticleMeta {
	title: string;
	cover?: string;
	keywords: string;
	summary: string;
}

const props = defineProps<ArticleMeta>();

const dialog = useDialog();

// metadata 是直接传的，复制一份防止影响原数据
const local = reactive<ArticleMeta>(toRaw(props));

function ok() {
	dialog.confirm(toRaw(local));
}

async function changeCover() {
	local.cover = await api.misc.uploadImageFile();
}
</script>

<style module lang="less">
.content {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr auto;
	grid-template-areas:
			"  cover   title"
			"  cover  summary"
			"keywords keywords";

	grid-gap: 1rem;
	width: 680px;
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
