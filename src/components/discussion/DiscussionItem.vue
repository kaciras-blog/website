<template>
	<discussion-content
		:value="value"
		@removed="$emit('removed')"
		@reply="$emit('reply')"
	>
		<template v-slot:footer>

			<!-- TODO: this.$refs.replies is undefined -->
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
					<!-- removed 事件必须包装一下，因为创建时还不存在 $refs.replies，下同 -->
					<template v-slot="{ items }">
						<reply-list :items="items" @removed="refresh"/>
					</template>
				</button-paging-view>

				<template v-else>
					<reply-list :items="value.replies" @removed="refresh"/>
					<a class="hd-link" @click="showAllReplies">查看全部</a>
				</template>
			</template>

			<input-h-o-c
				v-if="replying === value.id"
				:type="value.type"
				:object-id="value.objectId"
				:parent="value.id"
				:class="$style.input"
				@submitted="submitReply"
			>
				<template v-slot="{ content, onSubmit, onInput }">
					<discussion-editor :content="content" :on-submit="onSubmit" @input="onInput"/>
				</template>
			</input-h-o-c>

		</template>
	</discussion-content>
</template>

<script>
import { debounceFirst } from "@kaciras-blog/server/lib/functions";
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
		replying: Number,
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
	}),
	methods: {
		async submitReply(reply) {
			this.expend = true;
			if (this.replies) {
				this.$refs.replies.switchToLast();
			} else {
				this.replies = [reply.data]; // 对没有过回复的处理
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
.input {
	margin-top: 20px;
}

.replyList {
	padding-top: 2rem;
}
</style>
