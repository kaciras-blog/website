<template>
<div class="segment">

	<div class="discuss-editor center-all" v-if="config.disable">
		已设置为禁止评论
	</div>
	<div class="discuss-editor center-all" v-else-if="config.loginRequired && !user">
		已禁止匿名评论,请先<a class='highlight' href='/login'>登录</a>
	</div>

	<div class="discuss-editor" v-else>

		<div v-if="user">
			<img :src='"/image/" + user.head' class='small head' alt="头像">
			<span class="name">{{user.name}}</span>
		</div>
		<div class="discusser" v-else>
			<img src='/image/akalin.jpg' class='small head' alt="头像">
			<span class="name">(匿名评论)</span>
		</div>

		<textarea class='input discuss-box' v-model="content" placeholder='说点什么吧'></textarea>

		<div class='buttons'>
			<button class='primary round'
					:disabled="submiting"
					@click='submitDiscuss'>
				<i class="far fa-paper-plane"></i><span>发表评论</span>
			</button>
		</div>
	</div>
</div>
</template>

<script>
import api from "../apis";
import Vuex from "vuex";
import {errorMessage} from "../utils";

export default {
	name: "DiscussEditor",
	data() {
		return {
			submiting: false,
			content: "",
			config: {},
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
				await api.discussion.add(this.$router.params.id, text);
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
}

.buttons {
	text-align: right;
}

.name {
	font-size: 1.1em;
	margin-left: .5em;
}
</style>
