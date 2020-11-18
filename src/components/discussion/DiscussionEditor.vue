<template>
	<div v-if="!options.enabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="!options.allowAnonymous && user.id === 0" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<div v-else :class="$style.form">
		<embedded-editor v-if="$mediaQuery.match('tablet+')" v-bind="context"/>
		<button v-else :class="$style.openFrameButton" @click="showEditorFrame">
			添加评论
		</button>
		<div v-if="options.moderation" :class="$style.warn">为防止滥用，评论将在审核后显示</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import MarkdownView from "@/markdown/MarkdownView";
import EditorFrame from "./EditorFrame";
import EmbeddedEditor from "./EmbeddedEditor";

export default {
	name: "DiscussEditor",
	components: {
		EmbeddedEditor,
		MarkdownView,
	},
	inject: ["context"],
	computed: mapState({
		user: "user",
		options: "discussionOptions",
	}),
	methods: {
		focus() {
			this.$refs.textarea.focus();
		},
		showEditorFrame() {
			this.$dialog.show(EditorFrame, this.context);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.shore {
	padding: 3rem 0 4rem 0 !important;
	font-size: 16px;
	text-align: center;
	color: @color-text-minor;
}

.form {
	margin-bottom: 1.5rem;
}

.openFrameButton {
	background: none;
	border: dashed 2px #ccc;
}

.warn {
	margin-top: 1.5rem;
	color: red;
	text-align: center;
}
</style>
