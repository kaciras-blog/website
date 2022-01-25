<!--
	根据评论对象定位评论的页面的功能，在支持删除或多种排序的情况下是做不到的，
	一旦评论删除后面的评论跟分页就无法计算，而一旦根据分数之类的排序同样也无法计算。
	如果真要查看父评论，可以像知乎一样弹窗。
-->
<template>
	<li>
		<div :class="$style.container">
			<img :src="value.user.avatar" alt="头像" :class="$style.avatar">

			<div :class="$style.bubble">
				<div :class="$style.header">
					<strong :class="$style.name">
						{{ value.nickname || value.user.name }}
					</strong>
					<time class="minor-text">
						{{ localDateMinute(value.time) }}
					</time>
					<span :class="$style.right">{{ value.floor }}楼</span>

					<kx-tool-button
						title="回复"

						@click="reply"
					>
						<i class="fas fa-reply"></i>
					</kx-tool-button>
				</div>

				<div v-if="value.parent" :class="$style.replyTo">
					@{{ value.parent.user.name }}
					<markdown-view :value="value.parent.content"/>
				</div>

				<markdown-view :class="$style.content" :value="value.content"/>
			</div>
		</div>

		<embedded-editor
			v-if="replying"
			ref="input"
			:class="$style.replyInput"
			:parent="value.id"
			:after-submit="replied"
		/>
	</li>
</template>

<script>
import { scrollToElement } from "@kaciras-blog/uikit";
import { localDateMinute } from "@/blog-plugin";
import MarkdownView from "@/markdown/MarkdownView.vue";
import EmbeddedEditor from "./EmbeddedEditor.vue";

export default {
	name: "DiscussionBubble",
	components: {
		EmbeddedEditor,
		MarkdownView,
	},
	props: {
		value: {} // 就是 Discussion 类型
	},
	data() {
		return { replying: false };
	},
	computed: {
		parentPreview() {
			const { content, user, floor, nickname } = this.value.parent;

			const displayName = (user.id === 0 && nickname) ? nickname : user.name;
			const ref = `> @${displayName}（${floor}楼）\n`;

			const quoted = content.split("\n").map(line => "> " + line).join("\n");
			return ref + quoted;
		}
	},
	methods: {
		localDateMinute,

		async reply() {
			this.replying = true;
			await this.$nextTick();

			const { input } = this.$refs;
			input.focus();
			scrollToElement(input.$el);
		},
		replied() {
			this.replying = false;
		}
	}
}
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: flex;
	margin-bottom: 20px;
}

.avatar {
	width: 48px;
	height: 48px;
	margin-right: 16px;

	border-radius: 4px;

	@media screen and (max-width: @length-screen-mobile) {
		width: 35px;
		height: 35px;
		margin-right: 8px;
	}
}

.bubble {
	flex: 1;

	border: solid 1px #e1e4e8;
	//border-radius: 4px;
	box-shadow: 2px 2px 2px #c6c6c6;

	// https://stackoverflow.com/a/35609992
	overflow: hidden;
}

.header {
	display: flex;
	align-items: center;
}

.name {
	margin: 0 15px;
}

.right {
	margin-left: auto;
	padding: .8em;
}

.content {
	padding: 16px;

	@media screen and (max-width: @length-screen-mobile) {
		padding: 8px;
	}
}

.replyInput {
	margin-left: 64px;
	margin-bottom: 20px;
}
</style>
