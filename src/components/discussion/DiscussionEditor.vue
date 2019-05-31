<template>
	<div v-if="!options.enabled" :class="$style.shore">
		已设置为禁止评论
	</div>

	<div v-else-if="!options.allowAnonymous && !user" :class="$style.shore">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
	</div>

	<div v-else>
		<div>
			<img class='small head'
				 :src='discusser.head'
				 alt="头像">
			<span :class="$style.name">{{discusser.name}}</span>
		</div>

		<textarea
			v-model="content"
			class='input'
			:class="$style.textarea"
			placeholder='说点什么吧'>
		</textarea>

		<div :class='$style.bottom_toolbar'>
			<span v-if="options.moderation" class="minor-text">
				为防止恶意刷评论，评论将在审核后显示
			</span>
			<kx-task-button
				class='primary'
				:class="$style.buttons"
				:on-click='doSubmit'>
				发表评论
			</kx-task-button>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { MessageBoxType } from "kx-ui/src/dialog";
import { errorMessage } from "../../utils";

export default {
	name: "DiscussEditor",
	props: {
		submit: {
			type: Function,
			required: true,
		},
	},
	data: () => ({
		content: "",
	}),
	computed: {
		discusser() {
			return this.user || { id: 0, head: "/image/akalin.jpg", name: "(匿名评论)" };
		},
		...mapState({ user: "user", options: "discussionOptions" }),
	},
	methods: {
		async doSubmit() {
			const { content, submit, $dialog } = this;

			if (!content || /^\s*$/.test(content)) {
				return; // 没写评论就按发表按钮
			}
			try {
				await submit(content);
				this.content = "";

				if(!this.options.moderation) {
					this.$emit("submitted");
				}
			} catch (e) {
				$dialog.messageBox("发表评论", errorMessage(e), MessageBoxType.Error);
			}
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.shore {
	padding: 3rem 0 4rem 0 !important;
	font-size: 16px;
	text-align: center;
	color: @color-text-minor;
}

.textarea {
	width: 100%;
	min-height: 8em;
	margin-top: 1rem;
	margin-bottom: 1rem;
	resize: vertical;
}

.name {
	font-size: 1.1em;
	margin-left: .5em;
}

.bottom_toolbar {
	display: flex;
	align-items: center;
}

.buttons {
	margin-left: auto;
}
</style>
