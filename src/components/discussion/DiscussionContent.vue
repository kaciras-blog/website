<template>
	<component :is="tag">

		<header :class="$style.header">
			<img
				:src="value.user.avatar"
				alt="头像"
				class="head"
				:class="$style.avatar"
			>

			<!-- 评论者的名字和时间 -->
			<div :class="$style.nameGroup">
				<div>
					<span :class="$style.stick" v-if="value.user.id === 2">博主</span>
					<span :class="$style.name">{{ value.nickname || value.user.name }}</span>
				</div>
				<time class="minor-text">{{ value.time | localDateMinute }}</time>
			</div>

			<span
				v-if="removable"
				:class="$style.clickable"
				@click="remove"
			>
				<i class="far fa-trash-alt"/>
				删除
			</span>
			<span
				v-if="!value.parent"
				:class="[$style.clickable, $style.meta]"
				@click="$emit('reply', value)"
			>
				<i class="fas fa-plus"/>
				添加回复
			</span>

			<!-- 右上角的楼层号，楼中楼不显示 -->
			<span v-if="!value.parent" class="minor-text"># {{ value.floor }}</span>
		</header>

		<markdown-view
			:class="$style.content"
			:value="value.content"
		/>
	</component>
</template>

<script>
import api, { DiscussionState } from "@/api";
import { errorMessage } from "@/utils";
import MarkdownView from "@/markdown/MarkdownView";

export default {
	name: "DiscussionContent",
	components: {
		MarkdownView,
	},
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
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.header {
	display: flex;
	font-size: 14px;
}

.avatar {
	display: block;
	float: left;
	position: relative;

	width: 48px;
	height: 48px;

	@media screen and (max-width: @length-screen-mobile) {
		width: 32px;
		height: 32px;
	}
}

.nameGroup {
	// 让保证末尾行靠底部
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	flex: 1;
	margin-left: 10px;
}

.stick {
	margin-right: .5em;
	border-radius: 3px;
	padding: 3px 6px;
	color: white;
	background-color: @color-primary;
}

.name {
	font-weight: 600;
}

.metas {
	composes: minor-text from global;

	display: flex;
	justify-content: flex-end;
	align-items: baseline;
}

.meta {
	margin-left: 16px;
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
}
</style>
