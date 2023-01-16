<template>
	<li :class='$style.container'>
		<div :class='$style.link'>
			<KxCheckBox
				v-model='checkedForward'
			/>
			<span>
				用户评论了文章：
				<a
					class='highlight'
					:href='topic.url'
				>
					{{ topic.name }}
				</a>
			</span>
		</div>

		<img
			:src='user.avatar'
			alt='头像'
			:class='$style.head'
			class='small head'
		>

		<div :class='$style.content'>
			<p :class='$style.name'>
				{{ user.name }}
			</p>
			<div>{{ content }}</div>
		</div>
	</li>
</template>

<script setup lang="ts">
import { KxCheckBox } from "@kaciras-blog/uikit";
import { useVModel } from "@vueuse/core";
import { Discussion, DiscussionState, Topic, User } from "@/api";

interface Discussion_Copy {
	// 多了一个属性
	checked: boolean;

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

const props = defineProps<Discussion_Copy>();
const emit = defineEmits(["update:checked"]);

const checkedForward = useVModel(props, "checked", emit);
</script>

<style module lang="less">
.container {
	display: grid;
	grid-template-areas: "link link" "head content";
	grid-template-columns: auto minmax(0, 1fr);
	gap: 20px 10px;

	padding: 20px 0;
	border-top: solid 1px #c9c9c9;
}

.link { grid-area: link; }

.head { grid-area: head; }

.content {
	grid-area: content;
	white-space: pre-wrap;
	word-wrap: break-word;
}

.name {
	font-size: 16px;
	font-weight: 600;
}
</style>
