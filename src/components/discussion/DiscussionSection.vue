<template>
	<boot-loader :load-fn="initialize">
		<header :class="$style.header">
			<h2 :class="$style.title">
				评论区({{ data.total }})
			</h2>

			<!-- TODO: 菜单是第三方库懒得改，手机下有点大，不好看 -->
			<div :class="$style.options">
				<select>
					<option></option>
					<option></option>
				</select>
			</div>
		</header>

		<input-section/>

		<component
			:is="$mediaQuery.match('mobile') ? 'ScrollPagingView' : 'ButtonPagingView'"
			ref="discussions"
			v-model="data"
			:page-size="30"
			:loader="fetchData"
			:show-top-buttons="true"
		>
			<template v-slot="{ items }">
				<ol :class="$style.list">
					<discussion-item
						v-for="item of items"
						:key="item.objectId"
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

<script setup lang="ts">
import { provide, ref, watch } from "vue";
import { useStore } from "vuex";
import api, { Discussion, DiscussionQuery } from "@/api";
import { ListQueryView } from "@/api/core";
import { LOAD_DISCUSSION_OPTIONS } from "@/store/types";
import BootLoader from "./BootLoader.vue";
import DiscussionItem from "./DiscussionItem.vue";
import InputSection from "./InputSection.vue";

const PAGE_SIZE = 30;
const NEST_SIZE = 3;

const MODE = [
	{ label: "楼中楼模式", value: 0 },
	{ label: "引用模式", value: 1 },
];

/**
 * 字段 + 方向的组合有一些是多余的，比如 nest_size + ASC；而且两个按钮让操作更复杂了。
 * 所以我决定还是使用预定义的排序选项。
 */
const ALL_SORTS = [
	{ label: "时间", value: "id,ASC" },
	{ label: "最新", value: "id,DESC" },
	{ label: "回复数", value: "nest_size,DESC" },
];

// 啊好想要 Hooks 啊，Vue3 全家桶快点出啊

function loadEnumFromStore(type: any[], key: string, default_: any) {
	if (typeof window === "undefined") {
		return default_;
	}
	const v = (localStorage.getItem(key) || default_).toString();
	const result = type.find(i => i.value.toString() === v);

	// 如果修改了枚举则保存的值可能无效，查找结果为 undefined，此时回退到默认。
	return result || type.find(i => i.value.toString() === default_);
}

interface DiscussSectionProps {
	type: number;
	objectId: number;
}

const props = defineProps<DiscussSectionProps>();

const store = useStore();

const data = ref<ListQueryView<Discussion>>({} as any);
const mode = ref(loadEnumFromStore(MODE, "DIS_MODE", 0));
const sort = ref(loadEnumFromStore(ALL_SORTS, "DIS_SORT", "id,ASC"));
const discussions = ref();

provide("context", {
	type: props.type,
	objectId: props.objectId,
	parent: 0,
	afterSubmit,
});

watch(mode, () => {
	reload();
	localStorage.setItem("DIS_MODE", mode.value.value);
});

watch(sort, () => {
	reload();
	localStorage.setItem("DIS_SORT", sort.value.value);
});

// reload - 重新加载，回到第一页；refresh - 刷新当前页
function reload() {
	discussions.value.reload();
}

function refresh() {
	discussions.value.refresh();
}

function fetchData(start: number, count: number, signal?: AbortSignal) {
	const { type, objectId } = props;

	const query: DiscussionQuery = {
		objectId: objectId,
		type: type,
		start,
		count,
		sort: sort.value.value,
	};

	if (mode.value.value === 0) {
		query.nestId = 0;
		query.childCount = NEST_SIZE;
	} else {
		query.includeParent = true;
	}

	return api.withCancelToken(signal).discuss.getList(query);
}

/**
 * 在支持多种排序下，很难确定一个评论的位置，所以没法转到刚提交的评论，
 * 为了用户体验，需要换种思路。
 *
 * 若是分页则刷新当前页；若是滚动加载则直接添加在当前页的最后（Bilibili 是这么做的）。
 */
function afterSubmit(entity: Discussion) {
	if ("reload" in discussions.value) {
		discussions.value.reload();
	} else {
		data.value.items.push(entity);
	}
}

/** 初始化，加载配置信息和第一页，完成时切换加载指示器到列表 */
function initialize() {
	return Promise.all([
		store.dispatch(LOAD_DISCUSSION_OPTIONS),
		fetchData(0, PAGE_SIZE).then(view => data.value = view),
	]);
}
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
