<template>
	<div v-if="loading" :class="$style.loading">
		<atom-spinner :animation-duration="1200" :size="64" color="#53bcff"/>
		<span :class="$style.loading_text">评论加载中</span>
	</div>
	<div v-else>
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
			:init-items="initItems"
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
	</div>
</template>

<script>
import api from "../../api";
import DiscussionEditor from "./DiscussionEditor.vue";
import Discussion from "./DiscussionItem.vue";
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";

const allSorts = [
	{ label: "最新", value: "id,DESC" },
	{ label: "最早评论", value: "id,ASC" },
	{ label: "点赞数", value: "vote,DESC" },
];

export default {
	name: "DiscussionSection",
	components: {
		DiscussionEditor,
		Discussion,
		AtomSpinner,
	},
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
		loading: true,
		initItems: [],

		replying: null,
		totalCount: 0,
		allSorts,
		sort: allSorts[0],
	}),
	methods: {
		// reload - 重新加载，回到第一页；refresh - 刷新当前页
		reload() {
			this.$refs.discussions.loadPage(0);
		},
		refresh() {
			return this.$refs.discussions.refresh();
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
		/** 评论发表后跳转到能显示新评论的位置 */
		showLast() {
			if (this.sort !== allSorts[0]) {
				this.$refs.discussions.switchToLast();
			}
		},
		submitDiscussion(text) {
			return api.discuss.add(this.objectId, this.type, text);
		},
		handleReplyStart(id) {
			this.replying = id;
		},
	},
	mounted() {
		const tasks = [
			this.loadDiscussions(0, 20).then(view => this.initItems = view.items),
			this.$store.dispatch("loadOptions"),
		];
		Promise.all(tasks).then(() => this.loading = false);
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30px 0;
}

.loading_text {
	margin-top: 10px;
	font-size: 16px;
}

.header {
	display: flex;
	align-items: center;
	font-size: initial;
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
