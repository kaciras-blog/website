<template>
	<div class="discuss-editor center-all" v-if="options.disable">
		已设置为禁止评论
	</div>
	<div class="discuss-editor center-all" v-else-if="options.loginRequired && !user">
		已禁止匿名评论,请先<a class='highlight' href='/login'>登录</a>
	</div>
	<div class="discuss-editor" v-else>
		<div>
			<img class='small head'
				 :src='discusser.head'
				 alt="头像">
			<span class="name">{{discusser.name}}</span>
		</div>

		<textarea
			class='input discuss-box'
			v-model="content"
			placeholder='说点什么吧'>
		</textarea>

		<div class='buttons'>
			<button
				class='primary round'
				:class="{ running: submiting }"
				:disabled="submiting"
				@click='submitDiscuss'>
				发表评论
			</button>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { errorMessage } from "../../utils";

export default {
	name: "DiscussEditor",
	props: {
		submit: {
			type: Function,
			required: true,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			submiting: false,
			content: "",
		};
	},
	computed: {
		discusser() {
			return this.user || { id: 0, head: "/image/akalin.jpg", name: "(匿名评论)" };
		},
		...mapState(["user"]),
	},
	methods: {
		async submitDiscuss() {
			const { content, submit, $dialog } = this.content;

			if (!content || /^\s*$/.test(content)) {
				return; // 没写评论就按发表按钮
			}

			this.submiting = true;
			try {
				await submit(content);
				this.content = "";
				this.$emit("discussion-added");
			} catch (e) {
				$dialog.messageBox("发表评论", errorMessage(e), "error");
			}
			this.submiting = false;
		},
	},
};
</script>

<style scoped lang="less">
.discuss-editor {
	display: flex;
	flex-direction: column;
	margin-top: 1rem;
}

.discuss-box {
	min-height: 10em;
	margin-top: 1rem;
	margin-bottom: 1rem;
	resize: vertical;
}

.buttons {
	text-align: right;
}

.name {
	font-size: 1.1em;
	margin-left: .5em;
}
</style>
