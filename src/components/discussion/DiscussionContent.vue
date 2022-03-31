<template>
	<component :is="tag">
		<header :class="$style.header">
			<img
				:src="value.user.avatar ?? DEFAULT_AVATAR"
				alt="头像"
				class="head"
				:class="$style.avatar"
			>

			<div :class="$style.nameGroup">
				<div>
					<span
						v-if="value.user.id === 2"
						:class="$style.stick"
					>
						博主
					</span>
					<span :class="$style.name">
						{{ value.nickname || value.user.name }}
					</span>
				</div>
				<time :class="$style.time">
					{{ localDateMinute(value.time) }}
				</time>
			</div>

			<!-- 这两个按钮用文字比图标更好 -->
			<kx-button
				v-if="user.isAdmin"
				type="text"
				color="dangerous"
				title="删除"
				:class="$style.clickable"
				@click="remove"
			>
				删除
			</kx-button>
			<kx-button
				type="text"
				title="回复"
				:class="$style.clickable"
				@click="$emit('reply', value)"
			>
				回复
			</kx-button>

			#{{ localFloor }}
		</header>

		<!-- 引用的内容 -->
		<slot/>

		<markdown-view
			:class="$style.content"
			:value="value.content"
			:doc-id="value.id.toString()"
		/>
	</component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import api, { Discussion, DiscussionState } from "@/api";
import MarkdownView from "@/markdown/MarkdownView.vue";
import { errorMessage } from "@/utils";
import { DEFAULT_AVATAR, localDateMinute } from "@/blog-plugin";
import { useCurrentUser } from "@/store";

interface DiscussContentProps {
	tag?: string;
	value: Discussion;
}

const props = withDefaults(defineProps<DiscussContentProps>(), {
	tag: "li",
});
const emit = defineEmits(["removed", "reply"]);

const dialog = useDialog();
const user = useCurrentUser();

/**
 * 楼层号，引用模式下返回 floor，楼中楼模式返回 nestFloor。
 * 这里使用 replies 属性是否存在来判断处于哪种模式，比起 provide-inject 少些代码。
 */
const localFloor = computed(() => {
	const { parent, floor, nestFloor } = props.value;
	const { replies } = (parent ?? props.value);
	if (!replies) {
		return floor; // 引用模式
	}
	if (!parent) {
		return nestFloor; // 顶层评论
	}
	return `${parent.nestFloor}-${nestFloor}`;
});

function remove() {
	return api.discuss.updateStates(props.value.id, DiscussionState.Deleted)
		.then(() => emit("removed", props.value))
		.catch(e => dialog.alertError("删除失败", errorMessage(e)));
}
</script>

<style module lang="less">
@import "../../css/imports";

.header {
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
	font-size: 1rem;
}

.avatar {
	display: block;
	float: left;
	position: relative;

	width: 48px;
	height: 48px;

	@media screen and (max-width: @length-screen-mobile) {
		width: 35px;
		height: 35px;
	}
}

.nameGroup {
	// 让保证末尾行靠底部
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex: 1;

	margin-left: 10px;
	font-size: 14px;
}

.stick {
	margin-right: .5em;
	padding: 3px 6px;

	font-size: .875em;
	border-radius: 3px;
	color: white;
	background-color: @color-primary;
}

.name {
	font-weight: 600;
}

.time {
	composes: minor-text from global;

	@media screen and (max-width: @length-screen-mobile) {
		font-size: .875em;
	}
}

.content {
	font-size: initial;
}

.clickable {
	padding: 5px 10px;
	margin-right: 5px;
	font-size: 0.875rem;
}
</style>
