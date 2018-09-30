<template>
	<section class="discuss panel">

		<header>
			<h2>评论区</h2>
			<span id="discuss-num">{{totalCount}}条</span>
		</header>
		<hr>

		<div class="segment">
			<discuz-editor :submit="submitDiscussion" @discussion-added="showLast"/>
		</div>

		<button-pageing-view
			ref="discussions"
			:loader="loadDiscussions">

			<discussion
				slot-scope="{ item }"
				:key="item.id"
				class="segment"
				:value="item"
				:replying="replying"
				@reply="replying = item.id"
				@item-removed="refresh"/>
		</button-pageing-view>
	</section>
</template>

<script>
import api from "../../api";
import discuzEditor from "./DiscuzEditor.vue";
import discussion from "./Discussion.vue";

export default {
	name: "DiscussPanel",
	props: {
		articleId: {
			type: Number,
			required: true,
		},
	},
	data:()  => ({
		replying: 0,
		totalCount: 0,
	}),
	components: { discuzEditor, discussion },
	methods: {
		refresh() {
			this.$refs.discussions.refresh();
		},
		loadDiscussions(index, size, cancelToken) {
			return api.discuss.getList(this.articleId, index * size, size, cancelToken)
				.then(res => { this.totalCount = res.total; return res;});
		},
		showLast() {
			this.$refs.discussions.switchToLast();
		},
		submitDiscussion(text) {
			// 文章以外的评论如何设计API？
			return api.discuss.add(this.articleId, text);
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImpoert";

.discuss {
	margin-top: 3rem;
	padding: 2rem .5rem;

	@media (min-width: @length-screen-mobile) {  padding: 2rem;  }

	& > header {
		font-size: initial;
		& > h2 {
			display: inline-block;
		}
	}
}

.round {
	border-radius: .4rem;
}

#discuss-num {
	float: right;
}
</style>
