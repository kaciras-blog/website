<template>
	<li :class='$style.container'>
		<RouterLink
			:to='articleLink(item)'
			tabindex='-1'
			:class='$style.cover_link'
		>
			<img
				:src='item.cover'
				alt='封面'
				:class='$style.cover'
			>
		</RouterLink>

		<h2 class='compact' :class='$style.title'>
			<RouterLink :to='articleLink(item)'>
				{{ item.title }}
			</RouterLink>
		</h2>

		<div :class='$style.summary'>
			{{ item.summary }}
		</div>

		<div class='tag-group' :class='$style.category'>
			<span
				v-for='c of item.categories'
				:key='c.id'
				class='tag-group-item'
			>
				{{ c.name }}
			</span>
		</div>

		<div class='minor-text' :class='$style.meta'>
			<span title='发表于' :class='$style.metaItem'>
				<EditIcon/>
				<RelativeTime :value='item.create'/>
			</span>
			<span title='浏览数' :class='$style.metaItem'>
				<EyeIcon/>
				<span>{{ item.viewCount }}</span>
			</span>
			<span title='评论数' :class='$style.metaItem'>
				<ChatIcon/>
				<span>{{ item.discussionCount }}</span>
			</span>
		</div>
	</li>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import ChatIcon from "bootstrap-icons/icons/chat-dots.svg?sfc";
import RelativeTime from "../../components/RelativeTime.vue";
import { articleLink } from "@/common";

interface PreviewItemProps {
	item: any;
}

defineProps<PreviewItemProps>();
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;

	padding: 15px 0;
	margin: 1rem 0;
	border-bottom: solid 1px @color-border;

	@media screen and (max-width: @length-screen-mobile) {
		padding: 10px 30px;
		justify-items: center;
	}

	@media screen and (min-width: @length-screen-mobile) {
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
				"cover   title "
				"cover  summary"
				"category meta "
	}
}

@media screen and (min-width: @length-screen-mobile) {
	.cover_link {
		grid-area: cover;
	}

	.title {
		grid-area: title;
	}

	.summary {
		grid-area: summary;
	}

	.category {
		grid-area: category;
	}

	.meta {
		grid-area: meta;
		justify-self: right;
	}
}

.cover {
	display: block;
	width: 16rem;
	height: 9rem;
	border-radius: 6px;

	@media screen and (max-width: @length-screen-mobile) {
		width: 80vw;
		height: 45vw;
		border-radius: 10px;
	}
}

.title {
	font-size: 1.5em;
	font-weight: 500;

	@media screen and (max-width: @length-screen-mobile) {
		text-align: center;
	}
}

.metaItem {
	margin-right: 1em;

	& > svg {
		vertical-align: -4px;
		font-size: 18px;
		margin-right: 4px;
	}
}
</style>
