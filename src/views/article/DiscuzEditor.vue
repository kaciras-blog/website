<template>
	<div class="center-all" :class="$style.container" v-if="options.disable">
		已设置为禁止评论
	</div>

	<div class="center-all" :class="$style.container" v-else-if="options.loginRequired && !user">
		已禁止匿名评论,请先
		<router-link class='highlight' to='/login'>登录</router-link>
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

		<div :class='$style.buttons'>
			<kx-task-button
				class='primary'
				:on-click='doSubmit'>
				发表评论
			</kx-task-button>
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
	data: () => ({
		content: "",
	}),
	computed: {
		discusser () {
			return this.user || { id: 0, head: "/image/akalin.jpg", name: "(匿名评论)" };
		},
		...mapState(["user"]),
	},
	methods: {
		async doSubmit () {
			const { content, submit, $dialog } = this;

			if (!content || /^\s*$/.test(content)) {
				return; // 没写评论就按发表按钮
			}

			try {
				await submit(content);
				this.content = "";
				this.$emit("discussion-added");
			} catch (e) {
				$dialog.messageBox("发表评论", errorMessage(e), "error");
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

.textarea {
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
