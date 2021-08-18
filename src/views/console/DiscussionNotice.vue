<template>
	<div>
		在 <a :href="props.url" class="highlight" target="_blank">{{ props.title }}</a>
		的 {{ props.floor }} 楼有新的评论：
		<blockquote :class="$style.content">{{ props.preview }}</blockquote>
	</div>
</template>

<script>
export default {
	name: "DiscussionNotice",
}
</script>

<style module lang="less">
.content {
	composes: minor-text from global;

	margin-left: 0;
	padding: 4px 0 4px 10px;
	border-left: solid 4px #ccc;
}
</style>
