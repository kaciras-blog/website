<!--
	【定位功能？】
	根据评论对象定位评论的页面的功能，在支持删除或多种排序的情况下是做不到的，
	一旦评论删除后面的评论跟分页就无法计算，而一旦根据分数之类的排序同样也无法计算。
	如果真要查看父评论，可以像知乎一样弹窗。

	【气泡样式？】
	像 IM 一样的气泡样式虽然更具亲和力，但布局宽度会受限，只适合文本。
	特别是本站评论支持 Markdown，排版空间更加重要，所以还是选择传统式布局。
-->
<template>
	<li>
		<discussion-content
			:value="$props"
			tag="div"
			@removed="$emit('removed')"
			@reply="showReplyEditor"
		>
			<blockquote v-if="parent" :class="$style.blockquote">
				<p>
					回复：
					@{{ displayName(parent) }}
					(#{{ parent.floor }})
				</p>
				<markdown-view :value="parent.content"/>
			</blockquote>
		</discussion-content>

		<template v-if="expend || children.items.length">
			<button-paging-view
				v-if="expend"
				ref="repliesEl"
				v-model="children"
				theme="text"
				:loader="loadNext"
				:page-size="PAGE_SIZE"
				:class="$style.nest"
			>
				<template v-slot="{ items }">
					<ol class="clean-list" :class="$style.list">
						<discussion-content
							v-for="item of items"
							:key="item.id"
							:value="item"
							:class="$style.reply"
							@removed="refresh"
							@reply="showReplyEditor"
						/>
					</ol>
				</template>
			</button-paging-view>

			<div v-else-if="$bp.isGreater('tablet')" :class="$style.nest">
				<ol class="clean-list" :class="$style.list">
					<discussion-content
						v-for="item of children.items"
						:key="item.id"
						:value="item"
						tag="li"
						:class="$style.reply"
						@removed="refresh"
						@reply="showReplyEditor"
					/>
				</ol>
				<a class="hd-link" @click="showAllReplies">
					共 {{ children.total }} 条回复 &gt;
				</a>
			</div>
			<div v-else :class="$style.nest">
				<ol class="clean-list" :class="$style.list">
					<li
						v-for="item of children.items.slice(0, 3)"
						:key="item.id"
						:class="$style.preview"
					>
						<span :class="$style.name">
							{{ item.user.name }}：
						</span>
						{{ item.content }}
					</li>
				</ol>
				<a class="hd-link" @click="showNestFrame">
					共 {{ children.total }} 条回复 &gt;
				</a>
			</div>
		</template>

		<input-section
			v-if="replyContext"
			:key="replyContext.parent.id"
			v-bind="replyContext"
			ref="editorEl"
			:class="$style.input"
		/>
	</li>
</template>

<script setup lang="ts">
import { inject, nextTick, ref } from "vue";
import { useBreakPoint, useDialog } from "@kaciras-blog/uikit";
import { debounceFirst } from "@kaciras-blog/server/lib/functions.js";
import api, { Discussion, DiscussionState, Topic, User } from "@/api";
import { ListQueryView } from "@/api/core";
import MarkdownView from "@/markdown/MarkdownView.vue";
import DiscussionContent from "./DiscussionContent.vue";
import ReplyFrame from "./ReplyFrame.vue";
import EditorFrame from "./EditorFrame.vue";
import InputSection from "./InputSection.vue";

const PAGE_SIZE = 10;

interface DiscussionCopy {
	type: number;
	objectId: number;
	id: number;
	parent?: Discussion;
	floor: number;
	nestId: number;
	nestFloor: number;
	nestSize: number;
	user: User;
	nickname?: string;
	content: string;
	time: number;
	state: DiscussionState;
	topic?: Topic;
	replies?: Discussion[];
}

const props = defineProps<DiscussionCopy>();
const emit = defineEmits(["removed", "afterSubmit"]);

const breakPoint = useBreakPoint();
const $dialog = useDialog();

const editorEl = ref<HTMLElement>();
const repliesEl = ref();
const expend = ref(false);
const replyContext = ref();

// 复用组件实例时重置。
const children = ref<ListQueryView<Discussion>>({
	total: props.nestSize,
	items: props.replies ?? [],
});

function displayName(value: Discussion) {
	const { nickname, user } = value;
	if (user.id > 0) {
		return user.name;
	}
	return nickname || user.name;
}

// 宽屏直接在下面加输入框，手机则弹窗。
async function showReplyEditor(parent: Discussion) {
	const ctx = {
		objectId: props.objectId,
		type: props.type,
		parent,
		onAfterSubmit: afterSubmit,
	};

	if (breakPoint.isGreater("tablet")) {
		replyContext.value = ctx;
		await nextTick();
		editorEl.value!.focus();
	} else {
		$dialog.show(EditorFrame, ctx);
	}
}

async function afterSubmit(entity: Discussion) {
	replyContext.value = null;
	await nextTick();

	// 引用模式等同于提交顶层评论，直接转到上层处理。
	const { replies } = props;
	if (replies === undefined) {
		return emit("afterSubmit", entity);
	}

	// 如果没展开（包含无回复）就刷新数据；
	// 展开了就只刷新当前页，不要改变用户阅读位置。
	if (expend.value) {
		return repliesEl.value.refresh();
	} else {
		children.value = await loadNext(0, PAGE_SIZE);
	}
}

const showAllReplies = debounceFirst(async () => {
	children.value = await loadNext(0, PAGE_SIZE);
	expend.value = true;
});

function showNestFrame() {
	// 回复界面也会改动数据，所以用 v-model 模式把这里的也更新。
	return $dialog.show(ReplyFrame, {
		host: props,
		modelValue: children.value,
		"onUpdate:modelValue": v => children.value = v,
	});
}

function refresh() {
	repliesEl.value.refresh();
}

function loadNext(start: number, count: number) {
	return api.discuss.getReplies(props.id, start, count);
}
</script>

<style module lang="less">
@import "../../css/imports";

.input {
	margin-top: 20px;
}

.nest {
	margin-top: 20px;
	padding: 15px;
	border-radius: 8px;
	background: #f7f7f7;

	@media screen and(min-width: @length-screen-mobile) {
		padding: 20px;
	}
}

/* 跟 Markdown 里的样式重复了，但用户应该能区分 */
.blockquote {
	margin: 14px 0;
	padding: 1em 1em 1px;

	background-color: #f8f8f8;
	border-left: 6px solid #bfbfbf;

	@media screen and(min-width: @length-screen-mobile) {
		font-size: initial;
	}
}

.list:not(:first-child) {
	margin-top: 20px;
}

.reply {
	margin-bottom: 2rem;
}

.name {
	color: #137ce7;
}

.preview {
	margin-bottom: .5rem;
	.line-clamp(2);
}
</style>
