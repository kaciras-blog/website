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
					<a class="hd-link" @click="showAllReplies">查看全部</a>
				</template>
			</div>

			<input-h-o-c
				v-if="replying"
				:type="value.type"
				:object-id="value.objectId"
				:parent="value.id"
				:class="$style.input"
				@submitted="submitReply"
			>
				<template v-slot="{ content, onSubmit, onInput }">
					<discussion-editor ref="editor" :content="content" :on-submit="onSubmit" @input="onInput"/>
				</template>
			</input-h-o-c>

		</template>
	</discussion-content>
</template>

<script>
import { debounceFirst } from "@kaciras-blog/server/lib/functions";
import { scrollToElement } from "@kaciras-blog/uikit";
import api from "@/api";
import ReplyFrame from "./ReplyFrame";
import ReplyList from "./ReplyList";
import InputHOC from "./InputHOC";
import DiscussionContent from "./DiscussionContent";
import DiscussionEditor from "./DiscussionEditor";

export default {
	name: "DiscussionItem",
	props: {
		value: {
			type: Object,
			required: true,
		},

	},
	components: {
		InputHOC,
		ReplyList,
		DiscussionContent,
		DiscussionEditor,
	},
	data: () => ({
		replies: null,
		expend: false,
		replying: false,
	}),
	methods: {
		async showReplyEditor() {
			this.replying = true;
			await this.$nextTick();

			const editor = this.$refs.editor;
			scrollToElement(editor.$el);
			editor.focus();
		},
		async submitReply(reply) {
			this.value.replyCount++;
			this.expend = true;
			await this.$nextTick();

			if (this.value.replies.length) {
				this.$refs.replies.switchToLast();
			} else {
				this.replies = { total: 1, items: [reply] };
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
