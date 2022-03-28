<template>
	<markdown-editor :class="$style.editor" v-model="current.content">
		<template #toolbar-left="{ ctx }">
			<text-tools :ctx="ctx"/>
			<media-tools :ctx="ctx"/>
		</template>
		<template #toolbar-right="{ ctx }">
			<config-toolbar :ctx="ctx"/>
			<kx-button
				class="primary"
				type="icon"
				title="修改简介"
				@click="showMetadataDialog"
			>
				<CardIcon/>
			</kx-button>
			<kx-button
				class="primary"
				type="icon"
				title="保存"
				@click="manualSave"
			>
				<SaveIcon/>
			</kx-button>
			<kx-button
				class="primary"
				type="icon"
				title="发布!"
				@click="showPublishDialog"
			>
				<PaperPlaneIcon/>
			</kx-button>
		</template>

		<template #statebar-left>
			<span v-if="autoSaveError" :class="$style.error">
				自动保存出错
			</span>
			<span v-else-if="draft.updateTime">
				上次保存：{{ localDateMinute(draft.updateTime) }}
			</span>
		</template>
	</markdown-editor>
</template>

<script setup lang="ts">
import api, { Article, Draft, DraftHistory } from "@/api";
import { onBeforeMount, onBeforeUnmount, reactive, ref, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useEventListener } from "@vueuse/core";
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import SaveIcon from "@material-design-icons/svg/filled/save.svg?sfc";
import CardIcon from "bootstrap-icons/icons/credit-card-2-front.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import { articleLink, localDateMinute } from "@/blog-plugin";
import { errorMessage } from "@/utils";
import MarkdownEditor from "@/markdown/MarkdownEditor.vue";
import TextTools from "@/markdown/TextTools.vue";
import ConfigToolbar from "@/markdown/ConfigToolbar.vue";
import MediaTools from "@/markdown/MediaTools.vue";
import PublishDialog from "./PublishDialog.vue";
import MetadataDialog from "./MetadataDialog.vue";

interface EditorPageProps {
	draftId: string;
}

const props = defineProps<EditorPageProps>();

const dialog = useDialog();
const router = useRouter();

const draft = reactive<Draft>({} as any);

const current = reactive<DraftHistory>({
	title: "",
	keywords: "",
	summary: "",
	content: "",
	time: 0,
	saveCount: 0,
});

/** 是否有在未保存的改动 */
const changes = ref(false);

const autoSaveError = ref<Error>();

let autoSaveTimer: any;

/**
 * 监视文本的改变，当改变时开始计时 5 分钟，到点自动保存
 */
function watchForAutoSave() {
	const callback = () => {
		unwatch();
		autoSaveTimer = setTimeout(autoSave, 5 * 60 * 1000);
	};
	const unwatch = watch(current, callback, { deep: true });
}

async function autoSave() {
	watchForAutoSave();

	try {
		await api.draft.save(draft.id, current.saveCount, current);
		draft.updateTime = Date.now();
		changes.value = false;
		autoSaveError.value = undefined;
	} catch (e) {
		autoSaveError.value = e;
	}
}

async function manualSave() {
	try {
		await api.draft.saveNewHistory(draft.id, current);

		draft.updateTime = Date.now();
		changes.value = false;
		autoSaveError.value = undefined;

		dialog.alertSuccess("保存成功");

		// 刷新自动保存的计时
		clearTimeout(autoSaveTimer);
		watchForAutoSave();
	} catch (e) {
		dialog.alertError("保存失败，请手动备份", errorMessage(e));
	}
}

async function showMetadataDialog() {
	const result = await dialog.show(MetadataDialog, current).confirmPromise;
	Object.assign(current, result);
}

async function showPublishDialog() {
	const article = await dialog.show<Article>(PublishDialog, { current, draft }).confirmPromise;
	changes.value = false;
	return router.push(articleLink(article));
}

async function loadHistory(saveCount: number) {
	const got = await api.draft.getHistory(draft.id, saveCount);
	Object.assign(current, got);
	draft.updateTime = current.time;
}

onBeforeRouteLeave(() => {
	if (!changes.value) {
		return;
	}
	const exit = window.confirm("有未保存的改动，是否退出？");
	if (!exit) {
		return false;
	}
});

useEventListener("beforeunload", event => {
	if (changes.value) {
		return event.returnValue = "Sure?";
	}
});

onBeforeMount(async () => {
	const got = await api.draft.get(parseInt(props.draftId));
	const { lastSaveCount, articleId } = got;
	Object.assign(draft, got);

	await loadHistory(lastSaveCount);

	changes.value = false;
	watch(current, () => changes.value = true, { deep: true });
	watchForAutoSave();

	if (!articleId && current.saveCount === 0) {
		await showMetadataDialog();
	}
});

onBeforeUnmount(() => clearTimeout(autoSaveTimer));
</script>

<style module lang="less">
.editor {
	height: 100vh;
}

.error {
	color: #ff4f4f;
	font-weight: 600;
}
</style>
