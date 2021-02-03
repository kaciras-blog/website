<template>
	<li>
		<discussion-content
			:value="value"
			tag="div"
			@removed="$emit('removed')"
			@reply="showReplyEditor"
		/>

		<template v-if="expend || replies.length > 0">
			<button-paging-view
				v-if="expend"
				ref="replies"
				v-model="replies"
				theme="text"
				:loader="loadNext"
				:page-size="10"
				:class="$style.nest"
			>
				<template v-slot="{ items }">
					<ol class="clean-list" :class="$style.list">
						<discussion-content
							v-for="item of items"
							:key="item.id"
							:value="item"
							:class="$style.reply"
							@removed="refresh"
						/>
					</ol>
				</template>
			</button-paging-view>
			<div v-else-if="$mediaQuery.match('tablet+')" :class="$style.nest">
				<ol class="clean-list" :class="$style.list">
					<discussion-content
						v-for="item of replies"
						:key="item.id"
						:value="item"
						:class="$style.reply"
						@removed="refresh"
					/>
				</ol>
				<a class="hd-link" @click="showAllReplies">
					共 {{ value.nestSize }} 条回复 &gt;
				</a>
			</div>
			<div v-else :class="$style.nest">
				<ol class="clean-list" :class="$style.list">
					<li
						v-for="item of replies"
						:key="item.id"
						:class="$style.preview"
					>
					<span :class="$style.name">
						{{ item.user.name }}：
					</span>
						{{ item.content }}
					</li>
				</ol>
				<a class="hd-link" @click="showNestFrame">
					共 {{ value.nestSize }} 条回复 &gt;
				</a>
			</div>
		</template>

		<input-section v-if="replying" ref="editor" :class="$style.input"/>
	</li>
</template>

<script>
import { scrollToElement } from "@kaciras-blog/uikit";
import { debounceFirst } from "@kaciras-blog/server/lib/functions";
import api from "@/api";
import DiscussionContent from "./DiscussionContent";
import ReplyFrame from "./ReplyFrame";
import EditorFrame from "./EditorFrame";
import InputSection from "./InputSection";

export default {
	name: "DiscussionItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	components: {
		DiscussionContent,
		InputSection,
	},
	data() {
		return {
			replies: this.value.replies,
			expend: false,
			replying: false,
		};
	},
	provide() {
		const context = {
			objectId: this.value.objectId,
			type: this.value.type,
			parent: this.value.id,
			afterSubmit: this.submitReply,
		};
		return { context };
	},
	methods: {
		// 宽屏直接在下面加输入框，手机则弹窗。
		async showReplyEditor() {
			if (this.$mediaQuery.match("tablet+")) {
				this.replying = true;
				await this.$nextTick();

				const editor = this.$refs.editor;
				scrollToElement(editor.$el);
				editor.focus();
			} else {
				this.$dialog.show(EditorFrame, this.$options.provide.call(this).context);
			}
		},
		async submitReply(entity) {
			this.value.replyCount++;
			this.expend = true;
			await this.$nextTick();

			if (this.value.replies.length) {
				this.$refs.replies.switchToLast();
			} else {
				this.replies = { total: 1, items: [entity] };
			}
		},
		showAllReplies: debounceFirst(function () {
			return this.loadNext(0, 10).then((replies) => {
				this.expend = true;
				this.replies = replies;
			});
		}),
		showNestFrame() {
			return this.$dialog.show(ReplyFrame, { value: this.value });
		},
		refresh() {
			this.$refs.replies.refresh();
		},
		loadNext(start, count) {
			return api.discuss.getReplies(this.value.id, start, count);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.input {
	margin-top: 20px;
}

.nest {
	margin-top: 20px;
	padding: 20px;
	border-radius: 8px;
	background: #f7f7f7;
}

.list:not(:first-child) {
	margin-top: 20px;
}

.reply {
	margin-bottom: 2rem;
}

.name {
	color: #137ce7;
}

.preview {
	margin-bottom: .5rem;
	.line-clamp(2);
}
</style>
