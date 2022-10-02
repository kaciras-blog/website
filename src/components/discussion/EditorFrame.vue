<template>
	<KxFrame :class='$style.container' title='编辑评论'>
		<template #actions>
			<button
				v-if='preview'
				:class='$style.headerButton'
				title='编辑'
				v-ripple
				@click='preview=false'
			>
				<EditIcon/>
			</button>
			<button
				v-else
				:class='$style.headerButton'
				title='预览'
				v-ripple
				@click='preview=true'
			>
				<EyeIcon/>
			</button>
			<button
				:class='$style.headerButton'
				title='帮助'
				v-ripple
				@click='showGuide'
			>
				<HelpIcon/>
			</button>
		</template>

		<MarkdownView
			v-if='preview'
			:class='$style.body'
			:value='content'
		/>
		<textarea
			v-else
			:class='$style.body'
			:value='content'
			name='content'
			:placeholder='placeholder'
			aria-label='输入评论'
			v-autofocus
			v-ime-input='handleInput'
		/>

		<div :class='$style.toolbar'>
			<img
				:src='user.avatar'
				alt='头像'
				:class='$style.avatar'
			>

			名字：
			<input
				v-model='nickname'
				name='nickname'
				:placeholder='user.name'
				:class='$style.nickname'
			>

			<KxTaskButton
				:class='$style.button'
				:on-click='handleSubmit'
			>
				发送
				<PaperPlaneIcon/>
			</KxTaskButton>
		</div>
	</KxFrame>
</template>

<script lang="ts">
export default { isolation: true };
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDialog, KxFrame, KxTaskButton } from "@kaciras-blog/uikit";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import HelpIcon from "bootstrap-icons/icons/question-circle.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import { Discussion } from "@/api";
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

const props = defineProps<EditContextProps_Copy>();
const emit = defineEmits(["close"]);

const user = useCurrentUser();
const dialog = useDialog();
const { nickname, content, handleInput, submit } = useDiscussContext(props);

const preview = ref(false);

const placeholder = computed(() => {
	const { parent } = props;
	if (!parent) {
		return "说点什么吧...";
	}
	return `回复 ${parent.user.name}:`;
});

async function handleSubmit() {
	await submit();
	emit("close");
}

function showGuide() {
	dialog.show(GuideDialog);
}
</script>

<style module lang="less">
.container {
	font-size: initial;
}

.headerButton {
	display: inline-flex;
	align-items: center;
	font-size: 24px;
	padding: 0 16px;
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
	align-items: center;
	padding: 10px;
	border-top: solid 1px #eee;
}

.avatar {
	composes: head from global;
	width: 32px;
	height: 32px;
	margin-right: 10px;
}

.nickname {
	flex: 1;
	margin-right: 10px;
}

.button {
	padding: 5px 10px;
	gap: 6px;
}
</style>
