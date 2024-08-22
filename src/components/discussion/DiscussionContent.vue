<template>
	<component :is='tag'>
		<header :class='$style.header'>
			<img
				:src='value.user.avatar ?? DEFAULT_AVATAR'
				alt='头像'
				:class='$style.avatar'
			>

			<div :class='$style.nameGroup'>
				<div>
					<!-- 如果内容换行了，编译器会在后面加空格 -->
					<span
						v-if='value.user.id === 2'
						:class='$style.stick'>博主</span>

					<span :class='$style.name'>
						{{ value.nickname || value.user.name }}
					</span>
				</div>
				<RelativeTime
					:class='$style.time'
					:value='value.time'
				/>
			</div>

			<!-- 这两个按钮用文字比图标更好 -->
			<KxButton
				v-if='currentUser.isAdmin'
				type='text'
				color='dangerous'
				title='删除'
				:class='$style.clickable'
				@click='remove'
			>
				删除
			</KxButton>
			<KxButton
				type='text'
				title='回复'
				:class='$style.clickable'
				@click='$emit("reply", value)'
			>
				回复
			</KxButton>

			#{{ localFloor }}
		</header>

		<!-- 引用的内容 -->
		<slot/>

		<LazyMarkdownView
			:class='$style.content'
			:value='value.content'
			:doc-id='value.id.toString()'
		/>
	</component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { KxButton, RelativeTime, useDialog } from "@kaciras-blog/uikit";
import api, { Discussion, DiscussionState } from "@/api/index.ts";
import LazyMarkdownView from "@/components/LazyMarkdownView.ts";
import { errorMessage } from "@/utils.ts";
import { DEFAULT_AVATAR } from "@/common.ts";
import { useCurrentUser } from "@/store/index.ts";

interface DiscussContentProps {
	tag?: string;
	nestRoot?: Discussion;
	value: Discussion;
}

const props = withDefaults(defineProps<DiscussContentProps>(), {
	tag: "li",
});
const emit = defineEmits(["removed", "reply"]);

const dialog = useDialog();
const currentUser = useCurrentUser();

/**
 * 楼层号，引用模式下返回 floor，楼中楼模式返回 parent.nestFloor-nestFloor。
 */
const localFloor = computed(() => {
	const { nestRoot } = props;
	const { replies, floor, nestFloor } = props.value;

	// 无 nestRoot 的是顶层评论，根据 replies 判断模式。
	// 有 nestRoot 的则是楼中楼。
	if (!nestRoot) {
		return replies ? nestFloor : floor;
	}
	return `${nestRoot.nestFloor}-${nestFloor}`;
});

function remove() {
	return api.discuss.updateStates(props.value.id, DiscussionState.Deleted)
		.then(() => emit("removed", props.value))
		.catch(e => dialog.alertError("删除失败", errorMessage(e)));
}
</script>

<style module lang="less">
@import "../../css/imports.less";

.header {
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
	font-size: 1rem;
}

.avatar {
	composes: head from global;

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
	/* 让保证末尾行靠底部 */
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

	@media screen and (max-width: @length-screen-mobile) {
		font-size: 0.75rem;
	}
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
