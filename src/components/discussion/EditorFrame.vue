<template>
	<KxFrame :class='$style.container' :title='title'>
		<template #actions>
			<button
				:class='$style.headerButton'
				title='帮助'
				v-ripple
				@click='showGuide'
			>
				<HelpIcon/>
			</button>
			<KxTaskButton
				type='icon'
				:class='$style.headerButton'
				:on-click='handleSubmit'
			>
				<PaperPlaneIcon :class='$style.icon'/>
			</KxTaskButton>
		</template>

		<LazyMarkdownView
			v-if='configPanel === Tab.Preview'
			:value='content'
			:class='$style.body'
		/>
		<textarea
			v-else
			:class='$style.body'
			:value='content'
			name='content'
			placeholder='支持 Markdown 语法'
			aria-label='输入评论'
			v-autofocus
			v-ime-input='(e: any) => content = e.target.value'
		/>

		<div :class='$style.toolbar'>
			<button
				:class='$style.button'
				:data-active='configPanel === Tab.Name'
				@click='switchTab(Tab.Name)'
			>
				<img
					:src='user.avatar'
					alt='头像'
					:class='$style.avatar'
				>
				用户名
			</button>
			<button
				:class='$style.button'
				:data-active='configPanel === Tab.Mail'
				@click='switchTab(Tab.Mail)'
			>
				<BellIcon :class='$style.icon'/>
				通知
			</button>
			<button
				:class='$style.button'
				:data-active='configPanel === Tab.Preview'
				@click='switchTab(Tab.Preview)'
			>
				<EyeIcon :class='$style.icon'/>
				预览
			</button>
		</div>

		<div
			v-if='configPanel === Tab.Mail'
			:class='$style.configPanel'
		>
			<div :class='$style.label'>
				邮箱（可选，用于回复提醒）
			</div>
			<input
				v-model='email'
				type='email'
				name='email'
			>
		</div>
		<div
			v-if='configPanel === Tab.Name'
			:class='$style.configPanel'
		>
			<div :class='$style.label'>
				名字（可选，最多 16 字）
			</div>
			<input
				v-model='nickname'
				name='nickname'
				:maxlength='USERNAME_LENGTH'
				:placeholder='user.name'
			>
		</div>
	</KxFrame>
</template>

<script lang="ts">
export default { isolation: true };
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDialog, KxFrame, KxTaskButton, vRipple, vImeInput, vAutofocus } from "@kaciras-blog/uikit";
import EyeIcon from "bootstrap-icons/icons/markdown.svg?sfc";
import HelpIcon from "bootstrap-icons/icons/question-circle.svg?sfc";
import BellIcon from "bootstrap-icons/icons/bell.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import { USERNAME_LENGTH } from "@/common.ts";
import { useCurrentUser } from "@/store/index.ts";
import LazyMarkdownView from "@/components/LazyMarkdownView.ts";
import GuideDialog from "./GuideDialog.vue";
import { DiscussEditProps, useDiscussContext } from "./editor-api.ts";

/**
 * Config Panel 的类型，因为到处再用懒得写一堆就简写了。
 */
enum Tab {
	None,
	Name,
	Mail,
	Preview,
}

const props = defineProps<DiscussEditProps>();

const user = useCurrentUser();
const dialog = useDialog();
const { nickname, email, content, submitSimple } = useDiscussContext(props);

const configPanel = ref(Tab.None);

const title = computed(() => {
	const { parent } = props;
	if (!parent) {
		return "编辑评论";
	}
	return `回复 ${parent.user.name}`;
});

function switchTab(value: Tab) {
	if (configPanel.value !== value) {
		configPanel.value = value;
	} else {
		configPanel.value = Tab.None;
	}
}

function showGuide() {
	dialog.show(GuideDialog);
}

async function handleSubmit(_: unknown, signal: AbortSignal) {
	(await submitSimple(signal)) && dialog.close();
}
</script>

<style module lang="less">
@import "../../css/imports.less";

.container {
	font-size: initial;
}

.headerButton {
	display: inline-flex;
	align-items: center;

	padding: 0 16px;
	font-size: 20px;
	border-radius: 0;
}

.body {
	padding: 10px;
	border: none;
	flex: 1;
	font-size: initial;

	&:focus-within {
		box-shadow: none;
	}
}

.toolbar {
	display: flex;
	justify-content: space-evenly;

	padding: 0 10px;
	border-top: solid 1px #eee;
}

.button {
	display: flex;
	gap: 3px;
	flex-direction: column;
	align-items: center;

	padding: 5px 15px;
	color: #444;
	font-size: 12px;

	&[data-active="true"] {
		color: @color-primary;
	}
}

.icon {
	width: 24px;
	height: 24px;
}

.avatar {
	composes: icon;
	border-radius: 50%;
}

.configPanel {
	padding: 15px;
	text-align: center;
}

.label {
	font-size: 0.875rem;
	margin-bottom: 4px;
}
</style>
