<template>
	<div v-if='options.disabled' ref='thisEl' :class='$style.shore'>
		已设置为禁止评论
	</div>

	<div
		v-else-if='options.loginRequired && user.id === 0'
		ref='thisEl'
		:class='$style.shore'
	>
		已禁止匿名评论,请先
		<RouterLink class='highlight' to='/login'>登录</RouterLink>
	</div>

	<!-- 必须用个元素包裹起来，形成单根以便接收上层的 class -->
	<div v-else>
		<EmbeddedEditor
			v-if='$bp.isGreater("tablet")'
			ref='thisEl'
			v-bind='props'
			:class='$style.form'
		/>

		<!-- 是在想不到更好看的做法了，还是用输入框的样式吧 -->
		<div
			v-else
			ref='thisEl'
			:class='$style.mobileSection'
		>
			<img
				:src='user.avatar'
				alt='头像'
				class='lite head'
			>
			<button
				type='button'
				:class='$style.fakeInput'
				@click='showEditorFrame'
			>
				说点什么吧...
			</button>
		</div>

		<p
			v-if='options.moderation'
			:class='$style.warn'
		>
			为防止滥用，评论将在审核后显示
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDialog } from "@kaciras-blog/uikit";
import { useCurrentUser, useDiscussOptions } from "@/store/index.ts";
import EmbeddedEditor from "./EmbeddedEditor.vue";
import EditorFrame from "./EditorFrame.vue";
import { DiscussEditProps } from "./editor-api.ts";

const props = defineProps<DiscussEditProps>();

const user = useCurrentUser();
const o = useDiscussOptions();
const dialog = useDialog();

const thisEl = ref<HTMLElement>();

const options = computed(() => o.options);

function focus() {
	thisEl.value!.focus();
}

function showEditorFrame() {
	dialog.show(EditorFrame, props);
}

defineExpose({ focus });
</script>

<style module lang="less">
@import "../../css/imports.less";

.shore {
	padding: 3rem 0 4rem 0 !important;
	font-size: 16px;
	text-align: center;
	color: @color-text-minor;
}

.form {
	margin-bottom: 1.5rem;
}

.mobileSection {
	display: flex;
	border-radius: 4px;
	padding: 14px;
	background: #f7f7f7;
}

.fakeInput {
	composes: input from global;

	flex: 1;
	margin-left: 10px;

	text-align: left;
	color: @color-text-minor;
	background: white;

	&:focus-within {
		border-color: @color-border;
		box-shadow: none;
	}
}

.warn {
	margin: 1.5rem 0;
	color: red;
	text-align: center;
}
</style>
