<template>
	<form>
		<img
			class='small head'
			alt='头像'
			:src='user.avatar ?? DEFAULT_AVATAR'
		>
		<label :class='$style.name'>
			名字（可选，最多 16 字）
			<input
				v-model='nickname'
				name='nickname'
				:maxlength='USERNAME_LENGTH'
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

		<KxButton
			href='/edit/manual'
			target='_blank'
			type='icon'
			:class='$style.guide'
		>
			<QuestionIcon/>
			<span class='hide-m'>帮助</span>
		</KxButton>

		<LazyMarkdownView
			v-if='preview'
			:class='$style.preview'
			:value='content'
		/>

		<!--
			输入框可能被默认聚焦，如果设了 required 属性，
			则一开始就会显示错误样式，这给用户感觉不好。

			不过这样表单验证就只能手动去做了，弹个框之类的。
		-->
		<textarea
			v-else
			ref='textareaEl'
			:class='$style.textarea'
			:value='content'
			name='content'
			:placeholder='placeholder'
			aria-label='输入评论'
			v-autofocus
			v-ime-input='handleInput'
		/>

		<div :class='$style.actions'>
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

			<!-- 同样由于用户感觉，不要搞禁用样式 -->
			<KxTaskButton
				:on-click='(_, s) => submit(s)'
			>
				发表评论
			</KxTaskButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import QuestionIcon from "bootstrap-icons/icons/question-circle.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import { KxButton, KxTaskButton, vAutofocus, vImeInput } from "@kaciras-blog/uikit";
import { DEFAULT_AVATAR, USERNAME_LENGTH } from "@/common";
import { useCurrentUser } from "@/store";
import LazyMarkdownView from "@/components/LazyMarkdownView.ts";
import { EditContextProps, useDiscussContext } from "./EditContext";

const props = defineProps<EditContextProps>();

const { nickname, email, content, handleInput, submit } = useDiscussContext(props);
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
	resize: vertical;
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
	font-size: 1rem;
	gap: 4px;
	float: right;
}

.actions {
	composes: btn-group from global;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
