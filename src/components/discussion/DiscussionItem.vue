<template>
	<li>
		<discussion-content
			:value="$props"
			tag="div"
			@removed="$emit('removed')"
			@reply="showReplyEditor"
		>
			<blockquote v-if="parent" :class="$style.blockquote">
				<i :class="$style.quoteStart"/>
				<div :class="$style.quoteText">
					<p>回复：@{{ displayName(parent) }}</p>
					<markdown-view :value="parent.content"/>
				</div>
				<i :class="$style.quoteEnd"/>
			</blockquote>
		</discussion-content>

		<template v-if="expend || replies?.length">
			<button-paging-view
				v-if="expend"
				ref="repliesEl"
				v-model="children"
				theme="text"
				:loader="loadNext"
				:page-size="10"
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
						/>
					</ol>
				</template>
			</button-paging-view>

			<div v-else-if="$mediaQuery.match('tablet+')" :class="$style.nest">
				<ol class="clean-list" :class="$style.list">
					<discussion-content
						v-for="item of replies"
						:key="item.id"
						:value="item"
						tag="li"
						:class="$style.reply"
						@removed="refresh"
					/>
				</ol>
				<a class="hd-link" @click="showAllReplies">
					共 {{ nestSize }} 条回复 &gt;
				</a>
			</div>
			<div v-else :class="$style.nest">
				<ol class="clean-list" :class="$style.list">
					<li
						v-for="item of replies"
						:key="item.id"
						:class="$style.preview"
					>
						<span :class="$style.name">
							{{ user.name }}：
						</span>
						{{ content }}
					</li>
				</ol>
				<a class="hd-link" @click="showNestFrame">
					共 {{ nestSize }} 条回复 &gt;
				</a>
			</div>
		</template>

		<input-section v-if="replying" ref="editorEl" :class="$style.input"/>
	</li>
</template>

<script setup lang="ts">
import { inject, nextTick, provide, ref, watch } from "vue";
import { scrollToElement, useDialog } from "@kaciras-blog/uikit";
import { debounceFirst } from "@kaciras-blog/server/lib/functions.js";
import api, { Discussion, DiscussionState, Topic, User } from "@/api";
import { ListQueryView } from "@/api/core";
import MarkdownView from "@/markdown/MarkdownView.vue";
import DiscussionContent from "./DiscussionContent.vue";
import ReplyFrame from "./ReplyFrame.vue";
import EditorFrame from "./EditorFrame.vue";
import InputSection from "./InputSection.vue";

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
defineEmits(["removed"]);

const $mediaQuery = inject<any>("$mediaQuery");
const $dialog = useDialog();
const parentContext = inject<any>("context");

const editorEl = ref<HTMLElement>();
const repliesEl = ref();
const expend = ref(false);
const replying = ref(false);

// 复用组件实例时重置。
const children = ref<ListQueryView<Discussion>>({} as any);
watch(props, () => children.value = {
	total: 0,
	items: [],
});

const replyContext = {
	afterSubmit,
	type: props.type,
	objectId: props.objectId,
	parent: props.id,
};

provide("context", replyContext);

function displayName(value: Discussion) {
	const { nickname, user } = value;
	if (user.id > 0) {
		return user.name;
	}
	return nickname || user.name;
}

// 宽屏直接在下面加输入框，手机则弹窗。
async function showReplyEditor() {
	if ($mediaQuery.match("tablet+")) {
		replying.value = true;
		await nextTick();
		scrollToElement(editorEl.value!);
	} else {
		$dialog.show(EditorFrame, replyContext);
	}
}

async function afterSubmit(entity: Discussion) {
	// props.replyCount++;
	replying.value = true;
	await nextTick();

	// 引用模式等同于提交顶层评论，直接转到上层处理。
	const { replies } = props;
	if (replies === undefined) {
		return parentContext.afterSubmit(entity);
	}

	expend.value = true;
	if (children.value.total > 0) {
		repliesEl.value.switchToLast();
	} else {
		children.value = { total: 1, items: [entity] };
	}
}

const showAllReplies = debounceFirst(async () => {
	const all = await loadNext(0, 10);
	expend.value = true;
	children.value = all;
});

function showNestFrame() {
	return $dialog.show(ReplyFrame, { value: props });
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

// Markdown 的段落已经有底间距了，所以去掉外层的。
.blockquote {
	display: flex;
	margin: 14px 0 0 0;
}

.quoteMark {
	font-size: 1.5rem;
	color: #777;

	@media screen and(min-width: @length-screen-mobile) {
		font-size: 1.75rem;
	}
}

.quoteStart {
	composes: fas fa-quote-left from global;
	composes: quoteMark;
}

.quoteEnd {
	composes: fas fa-quote-right from global;
	composes: quoteMark;

	align-self: flex-end;
	margin-bottom: 1rem; // 底部与段落元素对齐
}

.quoteText {
	flex: 1;
	margin: 0 .8rem;

	overflow: hidden;

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
