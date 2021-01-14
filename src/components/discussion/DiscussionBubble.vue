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
						{{ value.time | localDateMinute }}
					</time>

					<kx-tool-button
						title="回复"
						:class="$style.right"
						@click="reply"
					>
						<i class="fas fa-reply"></i>
					</kx-tool-button>
				</div>

				<blockquote v-if="value.parent">
					{{ parentPreview }}
				</blockquote>

				<markdown-view :class="$style.content" :value="value.content"/>
			</div>
		</div>

		<embedded-editor
			v-if="replying"
			:class="$style.replyInput"
			:parent="value.id"
			:after-submit="replied"
		/>
	</li>
</template>

<script>
import MarkdownView from "@/markdown/MarkdownView";
import EmbeddedEditor from "./EmbeddedEditor";

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
			return this.value.parent.content.substring(0, 200);
		}
	},
	methods: {
		reply() {
			this.replying = true;
		},
		replied() {
			this.replying = false;
		}
	}
}
</script>

<style module lang="less">
.container {
	display: flex;
	margin-bottom: 20px;
}

.avatar {
	width: 48px;
	height: 48px;
	border-radius: 4px;
}

.bubble {
	flex: 1;
	margin-left: 1em;

	border: solid 1px #e1e4e8;
	border-radius: 4px;

	//
	// https://stackoverflow.com/a/35609992
	overflow: hidden;
}

.header {
	display: flex;
	align-items: center;
	background-color: #f6f8fa;
}

.name {
	margin: 0 15px;
}

.right {
	margin-left: auto;
	padding: .8em;
}

.content {
	padding: 15px;
}

.replyInput {
	margin-left: 64px;
	margin-bottom: 20px;
}
</style>
