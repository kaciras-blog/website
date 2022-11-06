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

		<MarkdownView
			v-if='configPanel === CP.Preview'
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
			v-ime-input='handleInput'
		/>

		<div :class='$style.toolbar'>
			<button
				:class='$style.button'
				:data-active='configPanel === CP.Name'
				@click='switchPanel(CP.Name)'
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
				:data-active='configPanel === CP.Mail'
				@click='switchPanel(CP.Mail)'

			>
				<BellIcon :class='$style.icon'/>
				通知
			</button>
			<button
				:class='$style.button'
				:data-active='configPanel === CP.Preview'
				@click='switchPanel(CP.Preview)'
			>
				<EyeIcon :class='$style.icon'/>
				预览
			</button>
			<button
				:class='$style.button'
				:data-active='configPanel === CP.Tools'
				@click='switchPanel(CP.Tools)'
			>
				<PlusCircleIcon :class='$style.icon'/>
				更多
			</button>
		</div>

		<div
			v-if='configPanel === CP.Name'
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
		<div
			v-if='configPanel === CP.Mail'
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
			v-if='configPanel === CP.Tools'
			:class='$style.configPanel'
		>
			TODO: 工具栏还没做好。
		</div>
	</KxFrame>
</template>

<script lang="ts">
export default { isolation: true };
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDialog, KxFrame, KxTaskButton } from "@kaciras-blog/uikit";
import EyeIcon from "bootstrap-icons/icons/markdown.svg?sfc";
import HelpIcon from "bootstrap-icons/icons/question-circle.svg?sfc";
import BellIcon from "bootstrap-icons/icons/bell.svg?sfc";
import PlusCircleIcon from "bootstrap-icons/icons/plus-circle.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import { Discussion } from "@/api";
import { USERNAME_LENGTH } from "@/common";
import { useCurrentUser } from "@/store";
import MarkdownView from "@/markdown/MarkdownView.vue";
import GuideDialog from "./GuideDialog.vue";
import { useDiscussContext } from "./EditContext";

interface EditContextProps_Copy {
	objectId: number;
	type: number;
	parent?: Discussion;
	onAfterSubmit: (entity: Discussion) => void;
}

/**
 * Config Panel 的类型，因为到处再用懒得写一堆就简写了。
 */
enum CP {
	None,
	Name,
	Mail,
	Preview,
	Tools,
}

const props = defineProps<EditContextProps_Copy>();

const user = useCurrentUser();
const dialog = useDialog();
const { nickname, email, content, handleInput, submit } = useDiscussContext(props);

const configPanel = ref<CP>(CP.None);

const title = computed(() => {
	const { parent } = props;
	if (!parent) {
		return "编辑评论";
	}
	return `回复 ${parent.user.name}`;
});

function switchPanel(value: CP) {
	if (configPanel.value !== value) {
		configPanel.value = value;
	} else {
		configPanel.value = CP.None;
	}
}

function showGuide() {
	dialog.show(GuideDialog);
}

async function handleSubmit(_: unknown, signal: AbortSignal) {
	(await submit(signal)) && dialog.close();
}
</script>

<style module lang="less">
@import "../../css/imports";

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
	resize: none;
	flex: 1;
	padding: 10px;
	border: none;
	font-size: initial;
	outline: none;
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
