<template functional>
	<ol class="clean-list" :class="$style.replies">
		<discussion-content
			v-for="item of props.items"
			:key="item.id"
			:value="item"
			:class="$style.reply"
			v-on="listeners"
		/>
	</ol>
</template>

<script>
import DiscussionContent from "./DiscussionContent";

export default {
	name: "ReplyList",
	components: { DiscussionContent },
	props: { items: Array },
};
</script>

<style module lang="less">
.replies { padding-top: 2rem; }
.reply { margin-bottom: 1.5rem; }
</style>
