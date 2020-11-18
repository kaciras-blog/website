<template>
	<kx-frame title="编辑评论" :class="$style.container">
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
			placeholder='说点什么吧'
			aria-label="输入评论"
			v-ime-input="handleInput"
		/>
		<div :class="$style.toolbar">
			<button :class="$style.guide" @click="showGuide">
				帮助
				<i class="far fa-question-circle"></i>
			</button>
			<div class="btn-group">
				<kx-button
					v-if="preview"
					icon="far fa-edit"
					title="编辑"
					@click="preview=false"
				>
					编辑
				</kx-button>
				<kx-button
					v-else
					icon="fas fa-eye"
					title="预览"
					@click="preview=true"
				>
					预览
				</kx-button>
				<kx-button
					class="primary"
					icon="far fa-paper-plane"
					@click="submit"
				>
					发送
				</kx-button>
			</div>
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
	flex: 1;
	border: none;
	padding: 8px;
}

.toolbar {
	display: flex;
	justify-content: space-between;
	padding: 8px;
	border-top: solid 1px #eee;
}
</style>
