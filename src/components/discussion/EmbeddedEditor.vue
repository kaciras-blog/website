<template>
	<img
		class='small head'
		alt='头像'
		:src='user.avatar ?? DEFAULT_AVATAR'
	>
	<label :class='$style.name'>
		名字（可选）
		<input
			v-model='nickname'
			name='nickname'
			:placeholder='user.name'
			:class='$style.nickname'
		>
	</label>
	<label :class='$style.name'>
		邮箱（可选，用于回复提醒）
		<input
			v-model='email'
			type='email'
			name='email'
			:class='$style.nickname'
		>
	</label>

	<button :class='$style.guide' @click='showGuide'>
		<QuestionIcon/>
		<span class='hide-m'>帮助</span>
	</button>

	<MarkdownView
		v-if='preview'
		:class='$style.preview'
		:value='content'
	/>
	<textarea
		v-else
		ref='textareaEl'
		:class='$style.textarea'
		class='input'
		:value='content'
		name='content'
		:placeholder='placeholder'
		aria-label='输入评论'
		v-autofocus
		v-ime-input='handleInput'
	/>

	<div :class='$style.bottom_toolbar'>
		<KxButton
			v-if='preview'
			type='outline'
			title='编辑'
			@click='preview=false'
		>
			<EditIcon class='prefix'/>
			编辑
		</KxButton>
		<KxButton
			v-else
			type='outline'
			title='预览'
			@click='preview=true'
		>
			<EyeIcon class='prefix'/>
			预览
		</KxButton>

		<KxTaskButton
			class='primary'
			:class='$style.submit'
			:on-click='submit'
		>
			发表评论
		</KxTaskButton>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import QuestionIcon from "bootstrap-icons/icons/question-circle.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import { KxButton, KxTaskButton, useDialog } from "@kaciras-blog/uikit";
import { DEFAULT_AVATAR } from "@/common";
import { useCurrentUser } from "@/store";
import { Discussion } from "@/api";
import MarkdownView from "@/markdown/MarkdownView.vue";
import { useDiscussContext } from "./EditContext";
import GuideDialog from "./GuideDialog.vue";

interface EditContextProps_Copy {
	objectId: number;
	type: number;
	parent?: Discussion;
	onAfterSubmit: (entity: Discussion) => void;
}

const props = defineProps<EditContextProps_Copy>();

const { nickname, email, content, handleInput, submit } = useDiscussContext(props);
const dialog = useDialog();
const user = useCurrentUser();

const preview = ref(false);
const textareaEl = ref<HTMLElement>();

/**
 * 跟百度贴吧一样的设计，用占位文字表示回复对象。
 */
const placeholder = computed(() => {
	const { parent } = props;
	if (!parent) {
		return "说点什么吧...";
	}
	return `回复 ${parent.user.name}:`;
});

function showGuide() {
	dialog.show(GuideDialog);
}

async function focus() {
	preview.value = false;
	await nextTick();
	textareaEl.value!.focus();
}

defineExpose({ focus });
</script>

<style module lang="less">
@import "../../css/imports";

.textarea, .preview {
	width: 100%;
	font-size: initial;
	min-height: 10em;
	margin: 1rem 0;
	padding: 10px;
	overflow-y: auto;
}

.textarea {
	border: solid 1px #dcdee0;
	resize: vertical;
}

.header {
	display: flex;
}

.name {
	display: inline-flex;
	flex-direction: column;
	margin-left: 1rem;
	font-size: small;
	vertical-align: top;
}

.nickname {
	margin-top: 3px;
	font-weight: 600;
}

.guide {
	composes: click-item from global;

	float: right;
	padding: 0;

	font-size: 1rem;
	align-self: flex-end;
	background: none;

	&:hover, &.active {
		color: #f785d7;
	}

	@media screen and (max-width: @length-screen-mobile) {
		font-size: 22px;
	}
}

.bottom_toolbar {
	composes: btn-group from global;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
