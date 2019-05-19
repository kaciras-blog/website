<template>
	<section>

		<header class="segment" :class="$style.header">
			<h2 :class="$style.title">
				评论区({{totalCount}})
			</h2>
			<vue-multiselect
				:class="$style.sort_select"
				v-model="sort"
				:options="allSorts"
				label="label"
				track-by="label"
				:allow-empty="false"
				:searchable="false"
				:show-labels="false"
				@input="reload"/>
		</header>

		<discussion-editor class="segment" :submit="submitDiscussion" @submitted="showLast"/>

		<button-paging-view
			:show-top-buttons="true"
			ref="discussions"
			:loader="loadDiscussions"
		>
			<template v-slot="{ items }">
				<ol v-if="items.length" class="list">
					<discussion
						v-for="item of items"
						:key="item.id"
						:value="item"
						:replying="replying"
						class="segment"
						@reply="handleReplyStart"
						@item-removed="refresh"/>
				</ol>
				<div :class="$style.empty" v-else>还没有评论呢</div>
			</template>
		</button-paging-view>
	</section>
</template>

<script>
import api from "../api";
import DiscussionEditor from "./DiscussionEditor.vue";
import Discussion from "./DiscussionItem.vue";

const allSorts = [
	{ label: "最新", value: "id,DESC" },
	{ label: "最早评论", value: "id,ASC" },
	{ label: "点赞数", value: "vote,DESC" },
];

export default {
	name: "DiscussionSection",
	props: {
		objectId: {
			type: Number,
			required: true,
		},
		type: {
			type: Number,
			required: true,
		},
	},
	data: () => ({
		replying: null,
		totalCount: 0,
		allSorts,
		sort: allSorts[0],
	}),
	components: { DiscussionEditor, Discussion },
	methods: {
		// reload - 重新加载，回到第一页；refresh - 刷新当前页
		reload() {
			this.$refs.discussions.loadPage(0);
		},
		refresh() {
			this.$refs.discussions.refresh();
		},
		loadDiscussions(index, size, cancelToken) {
			return api
				.withCancelToken(cancelToken)
				.discuss
				.getList(this.objectId, this.type, index * size, size, this.sort.value)
				.then(res => {
					this.totalCount = res.total;
					return res;
				});
		},
		showLast() {
			this.$refs.discussions.switchToLast();
		},
		submitDiscussion(text) {
			// 文章以外的评论如何设计API？
			return api.discuss.add(this.objectId, this.type, text);
		},
		handleReplyStart(id) {
			this.replying = id;
		},
	},
	mounted() {
		this.refresh();
	},
};
</script>

<style module lang="less">
@import "../css/Imports";

.header {
	font-size: initial;
	display: flex;
	align-items: center;
}

.title {
	display: inline-block;
	margin: 0;
}

.sort_select {
	width: 8em;
	margin-left: auto;
}

.empty {
	padding: 30px 0;
	text-align: center;
	color: @color-text-minor;
}
</style>
