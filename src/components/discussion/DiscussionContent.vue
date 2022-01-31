<template>
	<component :is="tag">

		<header :class="$style.header">
			<img
				:src="value.user.avatar"
				alt="头像"
				class="head"
				:class="$style.avatar"
			>

			<div :class="$style.nameGroup">
				<div>
					<span
						v-if="value.user.id === 2"
						:class="$style.stick"
					>
						博主
					</span>
					<span :class="$style.name">
						{{ value.nickname || value.user.name }}
					</span>
				</div>
				<div>
					<time :class="$style.time">
						{{ localDateMinute(value.time) }}
					</time>
				</div>
			</div>

			<kx-button
				type="icon"
				v-if="removable"
				title="删除"
				:class="$style.clickable"
				@click="remove"
			>
				<TrashIcon/>
			</kx-button>
			<kx-button
				type="icon"
				title="回复"
				:class="$style.clickable"
				@click="$emit('reply', value)"
			>
				<ReplyIcon/>
			</kx-button>
		</header>

		<!-- 引用的内容 -->
		<slot/>

		<markdown-view :class="$style.content" :value="value.content"/>
	</component>
</template>

<script>
import TrashIcon from "bootstrap-icons/icons/trash.svg?sfc";
import ReplyIcon from "bootstrap-icons/icons/reply.svg?sfc";
import api, { DiscussionState } from "@/api";
import { errorMessage } from "@/utils";
import MarkdownView from "@/markdown/MarkdownView.vue";
import { localDateMinute } from "@/blog-plugin";

export default {
	name: "DiscussionContent",
	components: {
		TrashIcon,
		ReplyIcon,
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
		localDateMinute,

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
	margin-bottom: 1rem;
	font-size: 14px;
}

.avatar {
	display: block;
	float: left;
	position: relative;

	width: 48px;
	height: 48px;

	@media screen and (max-width: @length-screen-mobile) {
		width: 35px;
		height: 35px;
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
	padding: 3px 6px;

	font-size: .875em;
	border-radius: 3px;
	color: white;
	background-color: @color-primary;
}

.name {
	font-weight: 600;
}

.time {
	composes: minor-text from global;

	@media screen and (max-width: @length-screen-mobile) {
		font-size: .875em;
	}
}

.content {
	font-size: initial;
}

.clickable {
	align-self: flex-start;
}
</style>
