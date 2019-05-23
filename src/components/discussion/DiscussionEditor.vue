<template>
	<div class="center-all" :class="$style.container" v-if="!options.enabled">
		<div class="minor-text" :class="$style.shore">已设置为禁止评论</div>
	</div>

	<div class="center-all" :class="$style.container" v-else-if="!options.allowAnonymous && !user">
		<div class="minor-text" :class="$style.shore">
			已禁止匿名评论,请先
			<router-link class='highlight' to='/login'>登录</router-link>
		</div>
	</div>

	<div :class="$style.container" v-else>
		<div>
			<img class='small head'
				 :src='discusser.head'
				 alt="头像">
			<span :class="$style.name">{{discusser.name}}</span>
		</div>

		<textarea
			class='input'
			:class="$style.textarea"
			v-model="content"
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
.container {
	display: flex;
	flex-direction: column;
	margin-top: 1rem;
}

.shore {
	padding: 3rem 0;
	text-align: center;
	font-size: 16px;
}

.textarea {
	min-height: 8em;
	margin-top: 1rem;
	margin-bottom: 1rem;
	resize: vertical;
}

.name {
	font-size: 1.1em;
	margin-left: .5em;
}

.buttons {
	margin-left: auto;
}

.bottom_toolbar {
	display: flex;
	align-items: center;
}
</style>
