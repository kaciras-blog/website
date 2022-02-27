<template>
	<li :class="$style.container">

		<div :class="$style.link">
			<kx-check-box v-model="checked"/>
			<span>
				用户评论了文章：
				<router-link
					class="highlight"
					:to="topic.url"
				>
					{{ topic.name }}
				</router-link>
			</span>
		</div>

		<img
			:src="user.avatar"
			alt="头像"
			:class="$style.head"
			class="small head"
		>

		<div :class="$style.content">
			<p :class="$style.name">
				{{ user.name }}
			</p>
			<div>{{ content }}</div>
		</div>
	</li>
</template>

<script setup lang="ts">
import { KxCheckBox } from "@kaciras-blog/uikit";
import { Discussion, DiscussionState, Topic, User } from "@/api";

interface Discussion_Copy {
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

defineProps<Discussion_Copy>();
</script>

<style module lang="less">
.container {
	display: grid;
	grid-template-areas: "link link" "head content";
	grid-template-columns: auto minmax(0, 1fr);
	grid-gap: 20px 10px;

	padding: 20px;
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
