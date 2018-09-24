<template>
	<div class="discuss-editor center-all" v-if="options.disable">
		已设置为禁止评论
	</div>
	<div class="discuss-editor center-all" v-else-if="options.loginRequired && !user">
		已禁止匿名评论,请先<a class='highlight' href='/login'>登录</a>
	</div>
	<div class="discuss-editor" v-else>
		<div v-if="user">
			<img class='small head'
				 :src='"/image/" + user.head'
				 alt="头像">
			<span class="name">{{user.name}}</span>
		</div>
		<div v-else>
			<img src='/image/akalin.jpg'
				 class='small head'
				 alt="头像">
			<span class="name">(匿名评论)</span>
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
				<i class="far fa-paper-plane"></i>发表评论
			</button>
		</div>
	</div>
</template>

<script>
import Vuex from "vuex";
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
	computed: Vuex.mapState(["user"]),
	methods: {
		async submitDiscuss() {
			const text = this.content;
			if (!text || /^\s*$/.test(text)) {
				return this.$dialog.messageBox("发表评论", "您还没有写评论呢", "error");
			}

			this.submiting = true;
			try {
				await this.submit(text);
				this.content = "";
				this.$emit("discussion-added");
			} catch (e) {
				this.$dialog.messageBox("发表评论", errorMessage(e), "error");
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
