<template>
	<div>
		<img :src="discusser.head" class="small head">
		<div class="discuss-main">
			<header class="discuss-header">
				<!-- 用户名 -->
				<span class='name'>{{discusser.name}}</span>
				<!-- 右边的楼层号 -->
				<span v-if="value.parent === 0" class="minor-text">{{value.floor}}楼</span>
			</header>

			<div class="content">{{value.content}}</div>

			<div class="minor-text metas">
				<div>
					<span class="meta"
						  :class="{ clickable: user.id > 0, active: value.voted }"
						  :title="value.voted ? '取消点赞' : '点赞'"
						  @click="vote">
						<i class="far fa-thumbs-up"></i>
						{{value.voteCount}}
					</span>

					<span v-if="value.parent === 0"
						  class="clickable meta"
						  @click="replyThis">
						<i class="far fa-comment"></i>
						回复({{value.replyCount}})
					</span>
				</div>

				<div>
					<span v-if="deleteable"
						  class="clickable meta"
						  @click='remove'>
						<i class="far fa-trash-alt"></i>删除
					</span>
					<time>{{value.time}}</time>
				</div>
			</div>

			<div v-if="value.replyCount>0">
				<discussion
					v-for="reply of value.replies"
					:key="reply.id"
					class="reply"
					:value="reply"/>
			</div>

			<discz-editor
				v-if="replying === value.id"
				:submit="submitReply"/>
		</div>
	</div>
</template>

<script>
import api from "../../apis";
import DisczEditor from "./DiscuzEditor.vue";
import { mapState } from "vuex";

export default {
	name: "Discussion",
	props: ["value", "replying"],
	components: {
		DisczEditor,
	},
	computed: {
		deleteable() {
			if (!this.user) return false;
			return this.user.id === 2;
		},
		discusser() {
			return this.value.user || { id: 0, head: "/image/akalin.jpg", name: "(匿名评论)" };
		},
		...mapState(["user"]),
	},
	methods: {
		submitReply(text) {
			api.discuss.reply(this.value.id, text);
		},
		remove() {
			api.discussion.deleteOne(this.value.id)
				.then(this.$emit("item-removed", this.value))
				.catch(r => alert("删除失败 " + r.message));
		},
		replyThis() {
			this.$emit("reply", this.value.id);
		},
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
	},
};
</script>

<style scoped>
.head {
	display: block;
	float: left;
	position: relative;
}

.discuss-main {
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
}

.tags > *:not(:last-child) {
	margin-right: 1em;
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

.discuss-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.reply {
	margin-top: 2rem;
}
</style>
