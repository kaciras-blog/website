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

			<vue-multiselect
				v-model="mode"
				title="评论结构"
				:class="$style.sortSelector"
				:options="MODE"
				label="label"
				track-by="label"
				:allow-empty="false"
				:searchable="false"
				:show-labels="false"
			/>

			<button
				v-if="order === 'ASC'"
				:class="$style.orderButton"
				title="升序"
				@click="order = 'DESC'"
			>
				<i class="fas fa-sort-amount-down-alt"></i>
			</button>
			<button
				v-if="order === 'DESC'"
				:class="$style.orderButton"
				title="降序"
				@click="order = 'ASC'"
			>
				<i class="fas fa-sort-amount-down"></i>
			</button>

			<vue-multiselect
				v-model="sort"
				title="排序方式"
				:class="$style.sortSelector"
				:options="ALL_SORTS"
				label="label"
				track-by="label"
				:allow-empty="false"
				:searchable="false"
				:show-labels="false"
			/>
		</header>

		<discussion-editor/>

		<component
			:is="$mediaQuery.match('mobile') ? 'ScrollPagingView' : 'ButtonPagingView'"
			ref="discussions"
			v-model="data"
			:loader="fetchData"
			:show-top-buttons="true"
		>
			<template v-slot="{ items }">
				<ol v-if="mode.value === 0" :class="$style.list">
					<discussion-bubble
						v-for="item of items"
						:key="item.id"
						:value="item"
						@removed="refresh"
					/>
				</ol>
				<ol v-else :class="$style.list">
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
import DiscussionBubble from "@/components/discussion/DiscussionBubble";

const NEST_SIZE = 3;

const MODE = [
	{ label: "引用模式", value: 0 },
	{ label: "楼中楼模式", value: 1 },
];

const ALL_SORTS = [
	{ label: "时间", value: "id" },
	{ label: "回复数", value: "nest_size" },
	{ label: "长度", value: "source" },
];

export default {
	name: "DiscussionSection",
	components: {
		DiscussionBubble,
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
		MODE,
		ALL_SORTS,

		loading: true,
		loadFail: false,
		data: null,

		mode: MODE[1],
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
	watch: {
		mode() {
			this.reload();
		},
		sort() {
			this.reload();
		},
		order() {
			this.reload();
		},
	},
	methods: {
		// reload - 重新加载，回到第一页；refresh - 刷新当前页
		reload() {
			this.$refs.discussions.reload();
		},
		refresh() {
			return this.$refs.discussions.refresh();
		},

		fetchData(start, count, cancelToken) {
			const { type, objectId, sort, order, mode } = this;

			const query = {
				objectId: objectId,
				type: type,
				start,
				count,
				sort: `${sort.value},${order}`,
			};

			if (mode.value === 0) {
				query.includeParent = true;
			} else {
				query.childCount = NEST_SIZE;
			}

			return api.withCancelToken(cancelToken).discuss.getList(query);
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
				this.fetchData(0, 20).then(view => this.data = view),
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
	composes: clean-list from global;
	margin: 30px 0;
}

.empty {
	padding: 30px 0;
	text-align: center;
	color: @color-text-minor;
}
</style>
