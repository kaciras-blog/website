<template>
	<section class="panel" :class="$style.container">

		<header :class="$style.header">
			<h2 :class="$style.title">评论区</h2>
			<span :class="$style.totalCount">{{totalCount}}条</span>
		</header>

		<hr>

		<div class="segment">
			<discuz-editor :submit="submitDiscussion" @discussion-added="showLast"/>
		</div>

		<button-pageing-view
			:show-top-buttons="true"
			ref="discussions"
			:loader="loadDiscussions">

			<ol class="list" slot-scope="{ items }">
				<discussion
					v-for="item of items"
					:key="item.id"
					class="segment"
					:value="item"
					:replying="replying"
					@reply="handleReplyStart"
					@item-removed="refresh"/>
			</ol>
		</button-pageing-view>
	</section>
</template>

<script>
import api from "../../api";
import discuzEditor from "./DiscuzEditor.vue";
import discussion from "./DiscussionItem.vue";

export default {
	name: "DiscussPanel",
	props: {
		articleId: {
			type: Number,
			required: true,
		},
	},
	data:()  => ({
		replying: null,
		totalCount: 0,
	}),
	components: { discuzEditor, discussion },
	methods: {
		refresh () {
			this.$refs.discussions.refresh();
		},
		loadDiscussions (index, size, cancelToken) {
			return api
				.withCancelToken(cancelToken)
				.discuss
				.getList(this.articleId, index * size, size)
				.then(res => {
					this.totalCount = res.total;
					return res;
				});
		},
		showLast () {
			this.$refs.discussions.switchToLast();
		},
		submitDiscussion (text) {
			// 文章以外的评论如何设计API？
			return api.discuss.add(this.articleId, text);
		},
		handleReplyStart (id) {
			this.replying = id;
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.container {
	margin-top: 3rem;
	padding: 2rem .5rem;

	@media (min-width: @length-screen-mobile) {  padding: 2rem;  }
}

.header {
	font-size: initial;
}

.title{
	display: inline-block;
}

.totalCount {
	float: right;
}
</style>
