<template>
	<li :class="$style.container">

		<div :class="$style.link">
			<kx-check-box v-model="item.checked"/>
			<span>
				用户评论了文章：
				<router-link
					class="highlight"
					:to="item.link">
					{{item.title}}
				</router-link>
			</span>
		</div>

		<img :src="item.user.head"
			 alt="头像"
			 :class="$style.head"
			 class="small head">

		<div :class="$style.content">
			<p :class="$style.name">{{item.user.name}}</p>
			<div>{{item.content}}</div>
		</div>
	</li>
</template>

<script>
export default {
	name: "DiscussionCheckItem",
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style module lang="less">
.container {
	display: grid;
	grid-template-areas: "link link" "head content";
	grid-template-columns: auto minmax(0, 1fr);
	grid-gap: 10px;

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
