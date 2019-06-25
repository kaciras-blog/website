<template>
	<discussion-content
		:value="value"
		@removed="$emit('removed', value)"
		@reply="$emit('reply', value.id)"
	>
		<template v-slot:footer>

			<template v-if="value.replyCount">
				<button-paging-view
					v-if="expend"
					ref="replies"
					v-model="replies"
					theme="text"
					:class="$style.replyList"
					:loader="loadNext"
					:page-size="10"
				>
					<!-- removed 事件处理必须包装一下，因为创建时还不存在 $refs.replies，下同 -->
					<template v-slot="{ items }">
						<reply-list :items="items" @removed="() => $refs.replies.refresh()"/>
					</template>
				</button-paging-view>

				<template v-else>
					<reply-list :items="value.replies" @removed="() => $refs.replies.refresh()"/>
					<a class="hd-link" @click="showAllReplies">查看全部</a>
				</template>
			</template>

			<discussion-editor
				v-if="replying === value.id"
				:class="$style.input"
				:submit="submitReply"
			/>
		</template>
	</discussion-content>
</template>

<script>
import DiscussionContent from "./DiscussionContent";
import DiscussionEditor from "./DiscussionEditor.vue";
import api from "../../api";
import ReplyFrame from "./ReplyFrame";
import ReplyList from "./ReplyList";
import { debounceFirst } from "kx-ui";

export default {
	name: "DiscussionItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
		replying: Number,
	},
	components: {
		ReplyList,
		DiscussionContent,
		DiscussionEditor,
	},
	data: () => ({
		replies: null,
		expend: false,
	}),
	methods: {
		async submitReply(text) {
			await api.discuss.reply(this.value.id, text);
			this.$emit("reply");
			this.$refs.replies.switchToLast();
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
		// 重复
		loadNext(start, count) {
			return api.discuss.getReplies(this.value.id, start, count);
		},
	},
};
</script>

<style module lang="less">
.input {
	margin-top: 20px;
}

.replyList {
	padding-top: 2rem;
}
</style>
