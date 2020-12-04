<template>
	<kx-frame :class="$style.container">
		<kx-frame-header title="编辑评论">
			<button
				v-if="preview"
				class="nav-item"
				title="编辑"
				v-ripple
				@click="preview=false"
			>
				<i class="far fa-edit"/>
			</button>
			<button
				v-else
				class="nav-item"
				title="预览"
				v-ripple
				@click="preview=true"
			>
				<i class="fas fa-eye"/>
			</button>

			<button
				class="nav-item"
				title="帮助"
				v-ripple
				@click="showGuide"
			>
				<i class="far fa-question-circle"/>
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

			<kx-button
				class="primary"
				icon="far fa-paper-plane"
				@click="submit"
			>
				发送
			</kx-button>
		</div>
	</kx-frame>
</template>

<script>
import { mapState } from "vuex";
import MarkdownView from "@/markdown/MarkdownView";
import MarkdownGuideDialog from "./MarkdownGuideDialog";
import DiscussionContext from "./DiscussionContext";

export default {
	name: "EditorFrame",
	mixins: [
		DiscussionContext,
	],
	isolation: true,
	components: {
		MarkdownView,
	},
	data: () => ({
		preview: false,
	}),
	computed: mapState(["user"]),
	methods: {
		focus() {
			this.$refs.textarea.focus();
		},
		showGuide() {
			this.$dialog.show(MarkdownGuideDialog);
		},
	},
};
</script>

<style module lang="less">
.container {
	font-size: initial;
}

.body {
	composes: kx-frame-body from global;
	border: none;
	padding: 10px;
	font-size: initial;
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
