<template>
	<div v-if="loading" :class="$style.loading">
		<atom-spinner :animation-duration="1200" :size="64" color="#53bcff"/>
		<span :class="$style.loading_text">评论加载中</span>
	</div>

	<div v-else-if="loadFail" :class="$style.loading">
		<span :class="$style.loading_fail_text">评论加载失败</span>
	</div>

	<div v-else>
		<header class="segment" :class="$style.header">
			<h2 :class="$style.title">
				评论区({{data.total}})
			</h2>
			<vue-multiselect
				v-model="sort"
				:class="$style.sort_select"
				:options="allSorts"
				label="label"
				track-by="label"
				:allow-empty="false"
				:searchable="false"
				:show-labels="false"
				@input="reload"/>
		</header>

		<discussion-editor
			class="segment"
			:submit="submitDiscussion"
			@submitted="showLast"
		/>

		<button-paging-view
			ref="discussions"
			v-model="data"
			:loader="loadDiscussions"
			:show-top-buttons="true"
		>
			<template v-slot="{ items }">
				<ol v-if="items.length" class="list">
					<discussion-item
						v-for="item of items"
						:key="item.id"
						:value="item"
						:replying="replying"
						class="segment"
						@reply="handleReplyStart"
						@item-removed="refresh"
					/>
				</ol>
				<div :class="$style.empty" v-else>还没有评论呢</div>
			</template>
		</button-paging-view>
	</div>
</template>

<script>
import api from "../../api";
import DiscussionEditor from "./DiscussionEditor.vue";
import DiscussionItem from "./DiscussionItem.vue";
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";

const allSorts = [
	{ label: "最新", value: "id,DESC" },
	{ label: "最早评论", value: "id,ASC" },
	{ label: "点赞数", value: "vote,DESC" },
];

export default {
	name: "DiscussionSection",
	components: {
		DiscussionItem,
		DiscussionEditor,
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
		loadFail: false,

		data: null,
		replying: null,
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
		loadDiscussions(start, size, cancelToken) {
			return api
				.withCancelToken(cancelToken)
				.discuss
				.getList(this.objectId, this.type, start, size, this.sort.value);
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

		/** 初始化，加载配置信息和第一页，完成时切换加载指示器到列表 */
		initialize() {
			const tasks = [
				this.loadDiscussions(0, 20).then(view => this.data = view),
				this.$store.dispatch("loadOptions"),
			];
			Promise.all(tasks)
				.catch(() => this.loadFail = true)
				.finally(() => this.loading = false);
		},
	},
	mounted() {
		this.$_observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				this.initialize();
				this.$_observer.disconnect();
				delete this.$_observer;
			}
		});
		this.$_observer.observe(this.$el);
	},
	destroyed() {
		if (this.$_observer) {
			this.$_observer.disconnect();
		}
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

// TODO: 错误字体和颜色用得挺多
.loading_fail_text {
	font-size: 16px;
	color: red;
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

.popup {
	position: absolute;
	.full-vertex;
}
</style>
