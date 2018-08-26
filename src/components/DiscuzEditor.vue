<template>
	<div class="flex vertical segment">

		<div class="discuss-box flex center-align center-content" v-if="config.disable">
			已设置为禁止评论
		</div>
		<div class="discuss-box flex center-align center-content" v-else-if="config.loginRequired && !user">
			已禁止匿名评论,请先<a class='highlight' href='/login'>登录</a>
		</div>

		<div class="flex vertical margin-vert" v-else>
			<div class="flex center-align margin" v-if="user">
				<img :src='"/image/" + user.head' class='head-small' alt="头像">
				<span style="font-size: 1.1em; margin-left: .5em">{{user.name}}</span>
			</div>

			<div class="flex center-align margin" v-else>
				<img src='/image/akalin.jpg' class='head-small' alt="头像"><span>(匿名评论)</span>
			</div>

			<textarea class='input discuss-box' v-model="content" placeholder='说点什么吧'></textarea>

			<div class='flex reserve'>
				<button class='primary round'
						:disabled="submiting"
						@click='submitDiscuss'>
					<i class="far fa-paper-plane"></i>发表评论
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../apis";
import Vuex from "vuex";

export default {
	name: "discuz-editor",
	data() {
		return {
			submiting: false,
			content: "",
			config: {},
		};
	},
	computed: Vuex.mapState(["user"]),
	methods:{
		async submitDiscuss() {
			const text = this.content;
			if (!text || /^\s*$/.test(text)) {
				return this.$dialog.messageBox("发表评论", "您还没有写评论呢", "error");
			}

			this.submiting = true;
			try{
				await api.discussion.add(this.$router.params.id, text);
				this.content = "";
				this.$emit("discussion-added");
			} catch(e) {
				this.$dialog.messageBox("发表评论", errMsg(e), "error");
			}
			this.submiting = false;
		},
	},
};
</script>
