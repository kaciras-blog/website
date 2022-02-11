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

			<kx-button
				v-if="removable"
				type="icon"
				title="删除"
				:class="$style.clickable"
				@click="remove"
			>
				<TrashIcon/>
			</kx-button>
			<kx-button
				type="icon"
				title="回复"
				:class="$style.clickable"
				@click="$emit('reply', value)"
			>
				<ReplyIcon/>
			</kx-button>

			<span :class="$style.floor">#{{ floor }}</span>
		</header>

		<!-- 引用的内容 -->
		<slot/>

		<markdown-view :class="$style.content" :value="value.content"/>
	</component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import TrashIcon from "bootstrap-icons/icons/trash.svg?sfc";
import ReplyIcon from "bootstrap-icons/icons/reply.svg?sfc";
import { useDialog } from "@kaciras-blog/uikit";
import api, { Discussion, DiscussionState } from "@/api";
import { errorMessage } from "@/utils";
import MarkdownView from "@/markdown/MarkdownView.vue";
import { DEFAULT_AVATAR, localDateMinute } from "@/blog-plugin";

interface DiscussContentProps {
	tag?: string;
	value: Discussion;
}

const props = withDefaults(defineProps<DiscussContentProps>(), {
	tag: "li",
});
const emit = defineEmits(["removed", "reply"]);

const dialog = useDialog();
const store = useStore();

const removable = computed(() => store.state.user.id === 2);

/**
 * 楼层号，引用模式下返回 floor，楼中楼模式返回 nestFloor。
 * 这里使用 replies 属性是否存在来判断处于哪种模式，比起 provide-inject 少些代码。
 */
const floor = computed(() => {
	const { parent, floor, nestFloor } = props.value;
	const { replies } = (parent ?? props.value);
	return Array.isArray(replies) ? nestFloor : floor;
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
	margin-bottom: 1rem;
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
	align-self: flex-start;
}

/* 直接微调居中，懒得再包层 flex 容器 */
.floor {
	margin-top: 6px;
	margin-left: 10px;
}
</style>
