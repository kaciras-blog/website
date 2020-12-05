<template>
	<discussion-content
		:value="value"
		@removed="$emit('removed')"
		@reply="showReplyEditor"
	>
		<template v-slot:footer>
			<div :class="$style.replyList" v-if="value.replyCount">
				<button-paging-view
					v-if="expend"
					ref="replies"
					v-model="replies"
					theme="text"
					:loader="loadNext"
					:page-size="10"
				>
					<!-- removed 事件必须包装一下，因为创建时还不存在 $refs.replies，下同 -->
					<template v-slot="{ items }">
						<reply-list :items="items" @removed="refresh"/>
					</template>
				</button-paging-view>

				<template v-else>
					<reply-list :items="value.replies" @removed="refresh"/>
					<a class="hd-link" @click="showAllReplies">
						共{{ value.replies.length }}条回复 &gt;
					</a>
				</template>
			</div>

			<discussion-editor v-if="replying" ref="editor" :class="$style.input"/>
		</template>
	</discussion-content>
</template>

<script>
import { debounceFirst } from "@kaciras-blog/server/lib/functions";
import { scrollToElement } from "@kaciras-blog/uikit";
import api from "@/api";
import ReplyFrame from "./ReplyFrame";
import ReplyList from "./ReplyList";
import DiscussionContent from "./DiscussionContent";
import DiscussionEditor from "./DiscussionEditor";
import EditorFrame from "./EditorFrame";

export default {
	name: "DiscussionItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	components: {
		ReplyList,
		DiscussionContent,
		DiscussionEditor,
	},
	data: () => ({
		replies: null,
		expend: false,
		replying: false,
	}),
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
			if (this.$mediaQuery.match("mobile")) {
				return this.$dialog.show(ReplyFrame, { value: this.value });
			}
			return this.loadNext(0, 10).then((replies) => {
				this.expend = true;
				this.replies = replies;
			});
		}),
		refresh() {
			this.$refs.replies.refresh();
		},
		// 重复
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

.replyList {
	margin-top: 20px;
	padding: 20px;
	border-radius: 8px;
	background: #f7f7f7;
}
</style>
