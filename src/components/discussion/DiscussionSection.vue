<template>
	<div v-if="loading" :class="$style.loading">
		<atom-spinner
			:animation-duration="1200"
			:size="64"
			color="#33aaff"
		/>
		<span :class="$style.loadingText">评论加载中</span>
	</div>

	<div v-else-if="loadFail" :class="$style.loading">
		<span :class="$style.loadingFailed">评论加载失败</span>
	</div>

	<div v-else>
		<header class="segment" :class="$style.header">
			<h2 :class="$style.title">
				评论区({{ data.total }})
			</h2>

			<button
				v-if="order === 'ASC'"
				:class="$style.orderButton"
				title="升序"
				@click="changeOrder('DESC')"
			>
				<i class="fas fa-sort-amount-down-alt"></i>
			</button>
			<button
				v-if="order === 'DESC'"
				:class="$style.orderButton"
				title="降序"
				@click="changeOrder('ASC')"
			>
				<i class="fas fa-sort-amount-down"></i>
			</button>

			<vue-multiselect
				v-model="sort"
				title="排序方式"
				:class="$style.sortSelector"
				:options="allSorts"
				label="label"
				track-by="label"
				:allow-empty="false"
				:searchable="false"
				:show-labels="false"
				@input="reload"
			/>
		</header>

		<discussion-editor/>

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
						class="segment"
						@removed="refresh"
					/>
				</ol>
			</template>
		</component>

		<div v-if="data.total===0" :class="$style.empty">还没有评论呢</div>
	</div>
</template>

<script>
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";
import api from "@/api";
import { LOAD_DISCUSSION_OPTIONS } from "@/store/types";
import DiscussionItem from "./DiscussionItem.vue";
import DiscussionEditor from "./DiscussionEditor.vue";

const ALL_SORTS = [
	{ label: "时间", value: "id" },
	{ label: "回复数", value: "reply" },
	{ label: "长度", value: "source" },
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
		allSorts: ALL_SORTS,

		loading: true,
		loadFail: false,
		data: null,

		sort: ALL_SORTS[0],
		order: "ASC",
	}),
	provide() {
		const context = {
			objectId: this.objectId,
			type: this.type,
			parent: 0,
			afterSubmit: this.showLatest,
		};
		return { context };
	},
	methods: {
		// reload - 重新加载，回到第一页；refresh - 刷新当前页
		reload() {
			this.$refs.discussions.reload();
		},
		refresh() {
			return this.$refs.discussions.refresh();
		},

		changeOrder(name) {
			this.order = name;
			this.$refs.discussions.reload();
		},

		loadDiscussions(start, count, cancelToken) {
			const { type, objectId, sort, order } = this;
			return api
				.withCancelToken(cancelToken)
				.discuss
				.getList({
					objectId: objectId,
					type: type,
					start,
					count,
					sort: `${sort.value},${order}`,
					childCount: 3,
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

.loadingText {
	margin-top: 10px;
	font-size: 16px;
}

// TODO: 错误字体和颜色用得挺多
.loadingFailed {
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
	margin: 0 auto 0 0;
}

.sortSelector {
	width: 8em;
	margin-left: 10px;
}

.orderButton {
	height: 40px;
	line-height: 40px;
	font-size: 25px;
	background: none;
	padding: 0 10px;
	cursor: pointer;

	&:hover, &:focus {
		background: #eee;
	}
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
