<template>
	<div v-if="options.disabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="options.loginRequired && user.id === 0" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<div v-else :class="$style.form">
		<embedded-editor v-if="$mediaQuery.match('tablet+')" v-bind="context"/>

		<!-- 是在想不到更好看的做法了，还是用输入框的样式吧 -->
		<div v-else :class="$style.mobileSection">
			<img :src="user.avatar" alt="头像" class="lite head">
			<button
				:class="$style.fakeInput"
				@click="showEditorFrame"
			>
				说点什么吧...
			</button>
		</div>

		<div v-if="options.moderation" :class="$style.warn">为防止滥用，评论将在审核后显示</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import MarkdownView from "@/markdown/MarkdownView.vue";
import EditorFrame from "./EditorFrame.vue";
import EmbeddedEditor from "./EmbeddedEditor.vue";

export default {
	name: "InputSection",
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
	margin-top: 1.5rem;
	color: red;
	text-align: center;
}
</style>
