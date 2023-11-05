<template>
	<MarkdownEditor
		v-model='current.content'
		renderer='rich'
		class='full-vertex'
		:drop-handler='handleDrop'
	>
		<template #toolbar-left>
			<!-- 虽然不是工具栏的组件，但还是放这免得根节点变成片段。-->
			<PageMeta title='编写文章' body-class=''/>

			<BaseSyntaxWeights></BaseSyntaxWeights>
			<MediaWeights v-bind='mediaUploader'/>
		</template>
		<template #toolbar-right>
			<ConfigWeights></ConfigWeights>
			<VerticalSeparator/>

			<KxButton
				class='primary'
				type='icon'
				title='修改简介'
				@click='showMetadataDialog'
			>
				<CardIcon/>
			</KxButton>
			<KxButton
				class='primary'
				type='icon'
				title='保存'
				@click='manualSave'
			>
				<SaveIcon/>
			</KxButton>
			<KxButton
				class='primary'
				type='icon'
				title='发布!'
				@click='showPublishDialog'
			>
				<PaperPlaneIcon/>
			</KxButton>
		</template>
		<template #status-left>
			<span v-if='saveError' :class='$style.error'>
				自动保存出错
			</span>
			<span v-else-if='draft.updateTime'>
				上次保存：
				<RelativeTime :value='draft.updateTime' :auto-refresh='60000'/>
			</span>
		</template>
		<template #status-right>
			<SelectionWeight></SelectionWeight>
		</template>
	</MarkdownEditor>
</template>

<script lang="ts">
import { PrefetchContext } from "@/prefetch.ts";
import { defineComponent } from "vue";

// 因为有防抖，创建之后再下载数据的话首屏会有一个渲染延迟，所以改用预载。
function asyncData(session: PrefetchContext) {
	const { data, route: { params }, api: { draft } } = session;
	const id = parseInt(params.draftId as string);

	const metadata = data.draft = draft.findById(id);
	data.latest = metadata.then(v => draft.getHistory(id, v.lastSaveCount));
}

export default defineComponent({ asyncData });
</script>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { KxButton, RelativeTime, useDialog } from "@kaciras-blog/uikit";
import SaveIcon from "@material-design-icons/svg/filled/save.svg?sfc";
import CardIcon from "bootstrap-icons/icons/credit-card-2-front.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import { articleLink } from "@/common.ts";
import { usePrefetch } from "@/store/index.ts";
import PageMeta from "@/components/PageMeta.ts";
import {
	MarkdownEditor,
	BaseSyntaxWeights,
	ConfigWeights,
	SelectionWeight,
	VerticalSeparator,
	MediaWeights,
	AddonContext,
} from "@kaciras-blog/markdown-vue";
import api, { Article, Draft, DraftHistory } from "@/api/index.ts";
import PublishDialog from "./PublishDialog.vue";
import MetadataDialog from "./MetadataDialog.vue";
import useAutoSave from "./useAutoSave.ts";
import useMediaUploader from "./useMediaUploader.ts";

const prefetch = usePrefetch().data;
const dialog = useDialog();
const router = useRouter();
const mediaUploader = useMediaUploader();

const draft = reactive<Draft>(prefetch.draft);
const current = reactive<DraftHistory>(prefetch.latest);

draft.updateTime = current.time;

const { changed, saveError, manualSave } = useAutoSave(current, async manual => {
	if (manual) {
		await api.draft.saveNewHistory(draft.id, current);
	} else {
		await api.draft.save(draft.id, current.saveCount, current);
	}

	draft.updateTime = Date.now();
});

/**
 * 处理拖放的函数，目前也就支持拖媒体文件来上传。
 * 如果拖了多个图片则会挨个弹上传窗，多个视频则认为是单视频的多版本。
 *
 * @param files 拖过来的文件们
 * @param ctx 编辑器上下文
 * @return 如果有能处理的就返回 true，否则走默认的拖放操作。
 */
function handleDrop(files: FileList, ctx: AddonContext) {
	insertMedias(files, ctx);
	return [].some(v => /(?:image|video|audio)\//.test(v));
}

// 因为要顺序执行异步操作，所以单独一个 async 函数。
async function insertMedias(files: FileList, ctx: AddonContext) {
	const videos = [];
	for (const file of files) {
		if (file.type.startsWith("image/")) {
			await mediaUploader.image(ctx, file);
		}
		if (file.type.startsWith("video/")) {
			videos.push(file);
		}
		if (file.type.startsWith("audio/")) {
			await mediaUploader.audio(ctx, file);
		}
	}
	if (videos.length > 0) {
		await mediaUploader.video(ctx, videos);
	}
}

async function showMetadataDialog() {
	const result = await dialog.show(MetadataDialog, current).confirmPromise;
	Object.assign(current, result);
}

async function showPublishDialog() {
	const article = await dialog.show<Article>(PublishDialog, { current, draft }).confirmPromise;
	changed.value = false;
	return router.push(articleLink(article));
}

onMounted(() => {
	// 如果是新创建的文章，且从未保存过，就自动弹出属性框，告诉用户先填属性。
	draft.articleId || current.saveCount > 0 || showMetadataDialog();
});
</script>

<style module lang="less">
.error {
	color: #ff4f4f;
	font-weight: 600;
}
</style>
