<template>
	<kx-frame :class="$style.container">
		<kx-frame-header title="编辑评论">
			<button
				v-if="preview"
				:class="$style.headerButton"
				title="编辑"
				v-ripple
				@click="preview=false"
			>
				<EditIcon/>
			</button>
			<button
				v-else
				:class="$style.headerButton"
				title="预览"
				v-ripple
				@click="preview=true"
			>
				<EyeIcon/>
			</button>
			<button
				:class="$style.headerButton"
				title="帮助"
				v-ripple
				@click="showGuide"
			>
				<HelpIcon/>
			</button>
		</kx-frame-header>

		<markdown-view
			v-if="preview"
			:class="$style.body"
			:value="content"
		/>
		<textarea
			v-else
			:class="$style.body"
			:value="content"
			name="content"
			placeholder='支持 Markdown，右上角有预览和帮助'
			aria-label="输入评论"
			v-autofocus
			v-ime-input="handleInput"
		/>

		<div :class="$style.toolbar">
			<img
				:src="user.avatar"
				alt="头像"
				:class="$style.avatar"
			>
			<input
				v-model="nickname"
				name="nickname"
				:placeholder="user.name"
				:class="$style.nickname"
			>

			<kx-task-button
				class="primary"
				icon="far fa-paper-plane"
				:on-click="handleSubmit"
			>
				发送
			</kx-task-button>
		</div>
	</kx-frame>
</template>

<script>
import { mapState } from "vuex";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import HelpIcon from "bootstrap-icons/icons/question-circle.svg?sfc";
import MarkdownView from "@/markdown/MarkdownView.vue";
import EditContext from "./EditContext";
import GuideDialog from "./GuideDialog.vue";

export default {
	name: "EditorFrame",
	mixins: [
		EditContext,
	],
	isolation: true,
	components: {
		MarkdownView,
		EyeIcon,
		EditIcon,
		HelpIcon,
	},
	data: () => ({
		preview: false,
	}),
	computed: mapState(["user"]),
	methods: {
		focus() {
			this.$refs.textarea.focus();
		},
		async handleSubmit() {
			await this.submit();
			this.$dialog.close();
		},
		showGuide() {
			this.$dialog.show(GuideDialog);
		},
	},
};
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
}

.nickname {
	margin: 0 auto 0 10px;
}
</style>
