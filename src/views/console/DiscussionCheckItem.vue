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
			:class='$style.avatar'
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
import { useVModel } from "@vueuse/core";
import { KxCheckBox } from "@kaciras-blog/uikit";
import { Discussion } from "@/api/index.ts";

const props = defineProps<Discussion & { checked: boolean }>();
const emit = defineEmits(["update:checked"]);

const checkedForward = useVModel(props, "checked", emit);
</script>

<style module lang="less">
.container {
	display: grid;
	grid-template-areas: "link link" "avatar content";
	grid-template-columns: auto minmax(0, 1fr);
	gap: 20px 10px;

	padding: 20px 0;
	border-top: solid 1px #c9c9c9;
}

.link {
	grid-area: link;
}

.avatar {
	composes: small head from global;
	grid-area: avatar;
}

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
