<template>
	<component :is="tag">

		<header :class="$style.header">
			<img
				:src="value.user.avatar"
				alt="头像"
				class="small head"
				:class="$style.head"
			>

			<!-- 评论者的名字和时间 -->
			<div :class="$style.nameGroup">
				<div>
					<span :class="$style.stick" v-if="value.user.id === 2">博主</span>
					<span :class="$style.name">{{ value.nickname || value.user.name }}</span>
				</div>
				<time class="minor-text">{{ value.time | localDateMinute }}</time>
			</div>

			<!-- 右上角的楼层号 -->
			<span class="minor-text">#{{ value.floor }}</span>
		</header>

		<div :class="$style.content">{{ value.content }}</div>

		<div class="minor-text" :class="$style.metas">
			<div>
				<span
					:title="value.voted ? '取消点赞' : '点赞'"
					class="meta"
					:class="{
							[$style.clickable]:true,
							[$style.active]: value.voted
						}"
					@click="vote"
				>
					<i class="far fa-thumbs-up"/>
					{{ value.voteCount }}
				</span>
				<span
					v-if="!value.parent"
					class="meta"
				>
					<i class="far fa-comment"/>
					回复({{ value.replyCount }})
				</span>
				<span
					v-if="removable"
					class="meta"
					:class="$style.clickable"
					@click="remove"
				>
					<i class="far fa-trash-alt"/>删除
				</span>
			</div>

			<span
				v-if="!value.parent"
				class="meta"
				:class="$style.clickable"
				@click="$emit('reply', value.id)"
			>
				<i class="fas fa-plus"/>
				添加回复
			</span>
		</div>

		<slot name="footer"></slot>
	</component>
</template>

<script>
import api, { DiscussionState } from "@/api";
import { errorMessage } from "@/utils";

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
			return this.$store.state.user.id === 2;
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
@import "../../css/imports";

.header {
	display: flex;
}

.head {
	display: block;
	float: left;
	position: relative;
}

.nameGroup {
	flex: 1;
	margin-left: 1rem;
}

.stick {
	margin-right: .5em;
	border-radius: 3px;
	padding: 4px;
	color: white;
	background-color: @color-button-primary;
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
	color: @color-second;
}

.content {
	margin-top: 1rem;
	margin-bottom: 1rem;
	line-height: 1.5;

	white-space: pre-wrap;
	word-wrap: break-word;
}
</style>
