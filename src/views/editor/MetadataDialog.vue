<template>
	<KxBaseDialog title='描述信息'>
		<form :class='$style.content'>
			<img
				:class='$style.cover'
				:src='local.cover ?? DEFAULT_COVER'
				alt='封面'
				@click='changeCover'
			/>
			<input
				v-model='local.title'
				title='标题'
				:class='$style.title'
				placeholder='标题最多50个字'
			/>
			<textarea
				v-model='local.summary'
				:class='$style.summary'
				placeholder='100字以内，留空则使用文章前50字'
			/>
		</form>
		<KxDialogButtons @accept='ok' @cancel='$dialog.close'/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { reactive, toRaw } from "vue";
import { KxBaseDialog, KxDialogButtons, useDialog } from "@kaciras-blog/uikit";
import api, { ArticleMeta } from "@/api";
import { DEFAULT_COVER } from "@/common";

defineOptions({ inheritAttrs: false });

const props = defineProps<ArticleMeta>();

const dialog = useDialog();

// metadata 是直接传的，复制一份防止影响原数据
const local = reactive<ArticleMeta>(toRaw(props));

function ok() {
	dialog.confirm(toRaw(local));
}

async function changeCover() {
	local.cover = await api.media.uploadImageFile();
}
</script>

<style module lang="less">
.content {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	grid-template-areas:
			"  cover   title"
			"  cover  summary";

	gap: 1rem;
	width: 680px;
}

.cover {
	grid-area: cover;
	width: 16rem;
	height: 9rem;
	cursor: pointer;
}

.title {
	grid-area: title;
}

.summary {
	grid-area: summary;
}
</style>
