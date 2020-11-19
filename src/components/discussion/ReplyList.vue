<template>
	<ol class="clean-list" :class="$style.list">
		<template v-if="$mediaQuery.match('tablet+')">
			<discussion-content
				v-for="item of items"
				:key="item.id"
				:value="item"
				:class="$style.reply"
				v-on="listeners"
			/>
		</template>
		<template v-else>
			<li
				v-for="item of items"
				:key="item.id"
				:class="$style.preview"
			>
				<span :class="$style.name">
					{{ item.user.name }}：
				</span>
				{{ item.content }}
			</li>
		</template>
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
@import "../../css/imports";

.list:not(:first-child) {
	margin-top: 1.5rem;
}

.reply {
	margin-bottom: 1.5rem;
}

.name {
	color: #137ce7;
}

.preview {
	margin-bottom: .5rem;
	.line-clamp(2);
}
</style>
