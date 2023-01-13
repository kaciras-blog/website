<template>
	<PageMeta title='编辑器' body-class=''/>

	<MarkdownEditor
		v-model='current.content'
		:class='$style.editor'
		:drop-handler='handleDrop'
	>
		<template #toolbar-left='{ ctx }'>
			<TextTools :ctx='ctx'/>
			<MediaTools ref='mediaTools' :ctx='ctx'/>
		</template>
		<template #toolbar-right='{ ctx }'>
			<ConfigToolbar :ctx='ctx'/>
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

		<template #statebar-left>
			<span v-if='autoSaveError' :class='$style.error'>
				自动保存出错
			</span>
			<span v-else-if='draft.updateTime'>
				上次保存：
				<RelativeTime :value='draft.updateTime'/>
			</span>
		</template>
	</MarkdownEditor>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, reactive, ref, shallowRef, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useEventListener } from "@vueuse/core";
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import SaveIcon from "@material-design-icons/svg/filled/save.svg?sfc";
import CardIcon from "bootstrap-icons/icons/credit-card-2-front.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import { articleLink } from "@/common";
import { errorMessage } from "@/utils";
import PageMeta from "@/components/PageMeta";
import RelativeTime from "../../components/RelativeTime.vue";
import MarkdownEditor from "@/markdown/MarkdownEditor.vue";
import TextTools from "@/markdown/TextTools.vue";
import ConfigToolbar from "@/markdown/ConfigToolbar.vue";
import MediaTools from "@/markdown/MediaTools.vue";
import api, { Article, Draft, DraftHistory } from "@/api";
import PublishDialog from "./PublishDialog.vue";
import MetadataDialog from "./MetadataDialog.vue";

interface EditorPageProps {
	draftId: string;
}

const props = defineProps<EditorPageProps>();

const dialog = useDialog();
const router = useRouter();

const draft = reactive<Draft>({} as any);
const mediaTools = shallowRef<any>();

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
 * 处理拖放的函数，目前也就支持拖媒体文件来上传。
 * 如果拖了多个图片则会挨个弹上传窗，多个视频则认为是单视频的多版本。
 *
 * @param files 拖过来的文件们
 * @return 如果有能处理的就返回 true，否则走默认的拖放操作。
 */
function handleDrop(files: FileList) {
	const images: File[] = [];
	const videos: File[] = [];

	for (const file of files) {
		if (file.type.startsWith("image/")) {
			images.push(file);
		}
		if (file.type.startsWith("video/")) {
			videos.push(file);
		}
	}

	insertMedias(images, videos);
	return images.length + videos.length > 0;
}

// 因为要顺序执行异步操作，所以单独一个 async 函数。
async function insertMedias(images: File[], videos: File[]) {
	for (const image of images) {
		await mediaTools.value.addImage(image);
	}
	if (videos.length) {
		await mediaTools.value.addVideo(videos);
	}
}

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
	const got = await api.draft.findById(parseInt(props.draftId));
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
