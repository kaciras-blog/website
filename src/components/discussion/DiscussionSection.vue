<template>
	<div v-if="loading" :class="$style.loading">
		<atom-spinner
			:animation-duration="1200"
			:size="64"
			color="#53bcff"
		/>
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
				@input="reload"
			/>
		</header>

		<input-h-o-c
			:object-id="objectId"
			:type="type"
			class="segment"
			@submitted="showLatest"
		>
			<template v-slot="{ content, onSubmit, onInput }">
				<discussion-editor
					:content="content"
					:on-submit="onSubmit"
					@input="onInput"
				/>
			</template>
		</input-h-o-c>

		<component
			:is="$mediaQuery.match('mobile') ? 'ScrollPagingView' : 'ButtonPagingView'"
			ref="discussions"
			v-model="data"
			:loader="loadDiscussions"
			:show-top-buttons="true"
		>
			<template v-slot="{ items }">
				<ol v-if="items.length" class="clean-list" :class="$style.list">
					<discussion-item
						v-for="item of items"
						:key="item.id"
						:value="item"
						:replying="replying"
						class="segment"
						@reply="replying = item.id"
						@removed="refresh"
					/>
				</ol>
				<div :class="$style.empty" v-else>还没有评论呢</div>
			</template>
		</component>
	</div>
</template>

<script>
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";
import api from "@/api";
import InputHOC from "@/components/discussion/InputHOC";
import { LOAD_DISCUSSION_OPTIONS } from "@/store/types";
import DiscussionItem from "./DiscussionItem.vue";
import DiscussionEditor from "./DiscussionEditor.vue";

const ALL_SORTS = [
	{ label: "最早评论", value: "id,ASC" },
	{ label: "最新", value: "id,DESC" },
	{ label: "点赞数", value: "vote,DESC" },
];

export default {
	name: "DiscussionSection",
	components: {
		InputHOC,
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
		allSorts: ALL_SORTS,
		sort: ALL_SORTS[0],
	}),
	methods: {
		// reload - 重新加载，回到第一页；refresh - 刷新当前页
		reload() {
			this.$refs.discussions.reload();
		},
		refresh() {
			return this.$refs.discussions.refresh();
		},

		loadDiscussions(start, count, cancelToken) {
			return api
				.withCancelToken(cancelToken)
				.discuss
				.getList({
					objectId: this.objectId,
					type: this.type,
					start,
					count,
					sort: this.sort.value,
					replySize: 3,
				});
		},

		/** 评论发表后跳转到能显示新评论的位置 */
		showLatest() {
			if (this.sort === ALL_SORTS[1]) {
				this.$refs.discussions.reload();
				this.$refs.discussions.scrollToStart();
			} else {
				this.$refs.discussions.switchToLast();
			}
		},

		/** 初始化，加载配置信息和第一页，完成时切换加载指示器到列表 */
		initialize() {
			const tasks = [
				this.loadDiscussions(0, 20).then(view => this.data = view),
				this.$store.dispatch(LOAD_DISCUSSION_OPTIONS),
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
@import "../../css/imports";

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

.list {
	margin: 30px 0;
}

.empty {
	padding: 30px 0;
	text-align: center;
	color: @color-text-minor;
}
</style>
