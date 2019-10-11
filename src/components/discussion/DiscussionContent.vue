<template>
	<component :is="tag">
		<img
			:src="value.user.head"
			alt="头像"
			class="small head"
			:class="$style.head"
		>

		<div :class="$style.main">

			<!-- 评论者的用户名和右上角的楼层号 -->
			<header :class="$style.header">
				<span :class="$style.name">{{value.user.name}}</span>
				<span v-if="!value.parent" class="minor-text">#{{value.floor}}</span>
			</header>

			<div :class="$style.content">{{value.content}}</div>

			<div class="minor-text" :class="$style.metas">
				<div>
					<span :title="value.voted ? '取消点赞' : '点赞'"
						  class="meta"
						  :class="[$style.clickable, { [$style.active]: value.voted }]"
						  @click="vote"
					>
						<i class="far fa-thumbs-up"></i>{{value.voteCount}}
					</span>

					<span v-if="!value.parent"
						  class="meta"
						  :class="$style.clickable"
						  @click="$emit('reply', value.id)"
					>
						<i class="far fa-comment"></i>回复({{value.replyCount}})
					</span>
				</div>

				<div>
					<span v-if="removable"
						  class="meta"
						  :class="$style.clickable"
						  @click="remove"
					>
						<i class="far fa-trash-alt"></i>删除
					</span>
					<time>{{value.time}}</time>
				</div>
			</div>

			<slot name="footer"></slot>
		</div>
	</component>
</template>

<script>
import api, { DiscussionState } from "@/api";
import {errorMessage} from "@/utils";

export default {
	name: "DiscussionContent",
	props: {
		value: {
			type: Object,
			required: true,
		},
		tag: {
			type: String,
			default: "li",
		},
	},
	computed: {
		removable() {
			const { user } = this.$store.state;
			return user && user.id === 2;
		},
	},
	methods: {
		remove() {
			api.discuss.updateStates(this.value.id, DiscussionState.Deleted)
				.then(() => this.$emit("removed", this.value))
				.catch(e => this.$dialog.alertError("删除失败", errorMessage(e)));
		},

		/** 点赞标签被点击时触发，如果用户已经点赞过则撤销点赞，否则增加点赞 */
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
</style>
