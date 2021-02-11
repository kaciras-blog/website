<template>
	<boot-loader :load-fn="initialize">
		<header :class="$style.header">
			<h2 :class="$style.title">
				评论区({{ data.total }})
			</h2>

			<!-- TODO: 菜单是第三方库懒得改，手机下有点大，不好看 -->
			<div :class="$style.options">
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
					:class="$style.sortSelect"
					:options="ALL_SORTS"
					label="label"
					track-by="label"
					:allow-empty="false"
					:searchable="false"
					:show-labels="false"
				/>

				<vue-multiselect
					v-model="mode"
					title="评论结构"
					:class="$style.modeSelect"
					:options="MODE"
					label="label"
					track-by="label"
					:allow-empty="false"
					:searchable="false"
					:show-labels="false"
				/>
			</div>
		</header>

		<input-section/>

		<component
			:is="$mediaQuery.match('mobile') ? 'ScrollPagingView' : 'ButtonPagingView'"
			ref="discussions"
			v-model="data"
			:loader="fetchData"
			:show-top-buttons="true"
		>
			<template v-slot="{ items }">
				<ol :class="$style.list">
					<discussion-item
						v-for="item of items"
						:key="Math.random()"
						:value="item"
						class="segment"
						@removed="refresh"
					/>
				</ol>
			</template>
		</component>

		<div v-if="data.total===0" :class="$style.empty">还没有评论呢</div>
	</boot-loader>
</template>

<script>
import api from "@/api";
import { LOAD_DISCUSSION_OPTIONS } from "@/store/types";
import BootLoader from "./BootLoader";
import DiscussionItem from "./DiscussionItem.vue";
import InputSection from "./InputSection.vue";
import DiscussionBubble from "./DiscussionBubble";

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

// 啊好想要 Hooks 啊，Vue3 全家桶快点出啊

function loadEnumFromStore(type, key, default_) {
	let v = loadFromStore(key, default_).toString();
	return type.find(i => i.value.toString() === v);
}

function loadFromStore(key, default_) {
	if (typeof window === "undefined") {
		return default_;
	}
	return localStorage.getItem(key) || default_;
}

export default {
	name: "DiscussionSection",
	components: {
		BootLoader,
		DiscussionBubble,
		DiscussionItem,
		InputSection,
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

		data: {},

		mode: loadEnumFromStore(MODE, "DIS_MODE", 0),
		sort: loadEnumFromStore(ALL_SORTS, "DIS_SORT", "id"),
		order: loadFromStore("DIS_ORDER", "ASC"),
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
			localStorage.setItem("DIS_MODE", this.mode.value);
		},
		sort() {
			this.reload();
			localStorage.setItem("DIS_SORT", this.sort.value);
		},
		order() {
			this.reload();
			localStorage.setItem("DIS_ORDER", this.order);
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
				query.nestId = 0;
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
			return Promise.all([
				this.$store.dispatch(LOAD_DISCUSSION_OPTIONS),
				this.fetchData(0, 20).then(view => this.data = view),
			]);
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.header {
	font-size: initial;
	display: flex;
	margin-bottom: 1.5rem;

	@media screen and (max-width: @length-screen-mobile) {
		flex-direction: column;
	}
	@media screen and (min-width: @length-screen-mobile) {
		padding-bottom: 1.5rem;
		border-bottom: solid 1px @color-border;
	}
}

.title {
	margin: 0;

	@media screen and (max-width: @length-screen-mobile) {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: solid 1px @color-border;
	}
}

.options {
	display: flex;
	align-items: center;
	margin-left: auto;
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

.modeSelect {
	width: 9em;
}

.sortSelect {
	width: 7em;
	margin: 0 10px;
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
