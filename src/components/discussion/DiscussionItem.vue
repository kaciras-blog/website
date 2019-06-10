<template>
	<discussion-content
		:value="value"
		@item-removed="$emit('item-removed', value)"
		@reply="$emit('reply', value.id)"
	>
		<template v-slot:footer>

			<ol v-if="value.replyCount"
				class="list"
				:class="$style.replies"
			>
				<discussion-content
					v-for="item of value.replies"
					:key="item.id"
					:value="item"
					:class="$style.reply"
					@item-removed="$emit('item-removed', item)"/>
			</ol>

			<a v-if="value.replyCount"
			   href="#"
			   class="hd-link"
			   @click.prevent="showAllReplies">
				查看全部
			</a>

			<discussion-editor
				v-if="replying === value.id"
				:submit="text => submitReply(text)"
			/>
		</template>
	</discussion-content>
</template>

<script>
import DiscussionContent from "./DiscussionContent";
import DiscussionEditor from "./DiscussionEditor.vue";
import api from "../../api";
import ReplyFrame from "./ReplyFrame";

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
		DiscussionContent,
		DiscussionEditor,
	},
	methods: {
		async submitReply(text) {
			await api.discuss.reply(this.value.id, text);
			this.$emit("reply");
			this.$refs.replies.switchToLast();
		},
		showAllReplies() {
			this.$dialog.show(ReplyFrame, { value: this.value });
		},
	},
};
</script>

<style module lang="less">
.replies {
	padding-top: 2rem;
}

.reply {
	margin-bottom: 1.5rem;
}
</style>
