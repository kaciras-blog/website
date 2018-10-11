<template>
	<li>
		<img :src="discusser.head"
			 class="small head"
			 :class="$style.head">

		<div :class="$style.main">

			<header :class="$style.header">
				<!-- 用户名 -->
				<span :class="$style.name">{{discusser.name}}</span>
				<!-- 右边的楼层号 -->
				<span v-if="value.parent === 0" class="minor-text">{{value.floor}}楼</span>
			</header>

			<div :class="$style.content">{{value.content}}</div>

			<div class="minor-text" :class="$style.metas">
				<div>
					<span class="meta"
						  :class="{ [$style.clickable]: discusser.id > 0, active: value.voted }"
						  :title="value.voted ? '取消点赞' : '点赞'"
						  @click="vote">
						<i class="far fa-thumbs-up"></i>
						{{value.voteCount}}
					</span>

					<span v-if="value.parent === 0"
						  class="meta"
						  :class="$style.clickable"
						  @click="replyThis">
						<i class="far fa-comment"></i>
						回复({{value.replyCount}})
					</span>
				</div>

				<div>
					<span v-if="deleteable"
						  class="meta"
						  :class="$style.clickable"
						  @click="remove">
						<i class="far fa-trash-alt"></i>
						删除
					</span>
					<time>{{value.time}}</time>
				</div>
			</div>

			<button-pageing-view
				v-if="value.replyCount>0"
				ref="replies"
				theme="text"
				:init-items="value.replies"
				:init-page-size="5"
				:init-total-count="value.replyCount"
				:loader="loadReplies">

				<ol class="list" slot-scope="{ items }">
					<discussion
						v-for="item of items"
						:key="item.id"
						:value="item"
						:class="$style.reply"/>
				</ol>
			</button-pageing-view>

			<discz-editor
				v-if="replying === value.id"
				:submit="submitReply"/>
		</div>
	</li>
</template>

<script>
import api from "../../api";
import DisczEditor from "./DiscuzEditor.vue";
import { mapState } from "vuex";

export default {
	name: "Discussion",
	props: {
		value: {
			type: Object,
			required: true,
		},
		replying: Number,
	},
	components: { DisczEditor },
	computed: {
		deleteable() {
			if (!this.user) return false;
			return this.user.id === 2;
		},
		discusser() {
			if(this.value.user.id) {
				return this.value.user;
			}
			return { id: 0, head: "/image/akalin.jpg", name: "(匿名评论)" };
		},
		...mapState(["user"]),
	},
	methods: {
		async submitReply(text) {
			await api.discuss.reply(this.value.id, text);
			this.$refs.replies.switchToLast();
		},
		remove() {
			api.discuss.deleteOne(this.value.id)
				.then(() => this.$emit("item-removed", this.value))
				.catch(r => alert("删除失败 " + r.message));
		},
		replyThis() {
			this.$emit("reply", this.value.id);
		},
		/**
		 * 点赞标签被点击时触发，如果用户已经点赞过则撤销点赞，否则增加点赞。
		 */
		vote() {
			const { value } = this;
			if (value.voted) {
				api.discuss.revokeVote(value.id)
					.then(() => value.voted = false)
					.then(() => value.voteCount--);
			} else {
				api.discuss.voteUp(value.id)
					.then(() => value.voted = true)
					.then(() => value.voteCount++);
			}
		},
		loadReplies(index, size, cancelToken) {
			return api.discuss.getReplies(this.value.id, index, size, cancelToken);
		},
	},
};
</script>

<style module lang="less">
.head {
	display: block;
	float: left;
	position: relative;
}

.main {
	position: relative;
	margin-left: 4rem;
}

.name {
	font-size: 16px;
	font-weight: 600;
}

.metas {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 2rem;
}

.clickable {
	cursor: pointer;
}

.clickable:hover, .active {
	color: #f785d7;
}

.content {
	margin-top: 1rem;
	margin-bottom: 1rem;
	white-space: pre-wrap;
	word-wrap: break-word;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.reply {
	margin-bottom: 1.5rem;
}
</style>
