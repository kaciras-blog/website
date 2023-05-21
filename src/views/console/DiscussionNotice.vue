<template>
	<div>
		在 <a :href='url' class='highlight' target='_blank'>{{ title }}</a>
		的 {{ floor }} 楼有新的评论：
		<blockquote :class='$style.content'>{{ preview }}</blockquote>
	</div>
</template>

<script setup lang="ts">
import { DiscussionActivity } from "@/api/index.ts";

defineProps<DiscussionActivity>();
</script>

<style module lang="less">
.content {
	composes: minor-text from global;

	margin-left: 0;
	padding: 4px 0 4px 10px;
	border-left: solid 4px #ccc;
}
</style>
