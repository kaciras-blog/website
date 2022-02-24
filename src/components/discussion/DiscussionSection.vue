<template>
	<boot-loader :load-fn="initialize">
		<header :class="$style.header">
			<h2 :class="$style.title">
				评论区({{ data.total }})
			</h2>

			<div :class="$style.options">
				<!-- 有些组合是多余的，比如 nest_size,ASC -->
				<kx-select
					:class="$style.sortSelect"
					v-model="sort"
					title="排序方式"
				>
					<option value="id,ASC">最早</option>
					<option value="id,DESC">最新</option>
					<option value="nest_size,DESC">回复数</option>
				</kx-select>

				<kx-select v-model="mode" title="评论结构">
					<option value="ref">引用模式</option>
					<option value="nest">楼中楼模式</option>
				</kx-select>
			</div>
		</header>

		<input-section
			:object-id="objectId"
			:type="type"
			@after-submit="afterSubmit"
		/>

		<component
			:is="$bp.value === 'mobile' ? 'ScrollPagingView' : 'ButtonPagingView'"
			ref="discussions"
			v-model="data"
			:page-size="30"
			:loader="fetchData"
			:top-buttons="true"
		>
			<template v-slot="{ items }">
				<ol :class="$style.list">
					<discussion-item
						v-for="item of items"
						v-bind="item"
						:key="item.id"
						class="segment"
						@after-submit="afterSubmit"
						@removed="refresh"
					/>
				</ol>
			</template>
		</component>

		<div v-if="data.total===0" :class="$style.empty">还没有评论呢</div>
	</boot-loader>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLocalStorage } from "@vueuse/core";
import api, { Discussion, DiscussionQuery } from "@/api";
import { ListQueryView } from "@/api/core";
import BootLoader from "./BootLoader.vue";
import DiscussionItem from "./DiscussionItem.vue";
import InputSection from "./InputSection.vue";
import { useDiscussOptions } from "@/store";

const PAGE_SIZE = 30;
const NEST_SIZE = 3;

interface DiscussSectionProps {
	type: number;
	objectId: number;
}

const props = defineProps<DiscussSectionProps>();

const discussOptions = useDiscussOptions();

const data = ref<ListQueryView<Discussion>>({ items: [], total: 0 });
const mode = useLocalStorage("DIS:mode", "nest");
const sort = useLocalStorage("DIS:sort", "id,ASC");
const discussions = ref();

/*
 * 当模式或排序改编后重新加载数据。注意这里更新了两个状态，其中 mode 先改变，
 * 然后异步地重载 data，在 data 更新之前数据处于不一致的状态！对此只能先同步地清空 data。
 */
watch([mode, sort], () => {
	data.value = { items: [], total: 0 };
	discussions.value.reload();
});

function refresh() {
	discussions.value.refresh();
}

function fetchData(start: number, count: number, signal?: AbortSignal) {
	const { type, objectId } = props;

	const query: DiscussionQuery = {
		objectId,
		type,
		start,
		count,
		sort: sort.value,
	};

	if (mode.value === "nest") {
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
 * 若是分页则刷新当前页；若是滚动加载则直接添加在当前页的最后（bilibili 是这么做的）。
 */
function afterSubmit(entity: Discussion) {
	if ("refresh" in discussions.value) {
		discussions.value.refresh();
	} else {
		data.value.items.push(entity);
	}
}

/** 初始化，加载配置信息和第一页，完成时切换加载指示器到列表 */
function initialize() {
	return Promise.all([
		discussOptions.load(),
		fetchData(0, PAGE_SIZE)
			.then(v => data.value = v),
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

.sortSelect {
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
