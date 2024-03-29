<template>
	<article :class='$style.container'>
		<RouterLink
			:to='articleLink(item)'
			tabindex='-1'
			:class='$style.coverLink'
		>
			<img
				:src='item.cover'
				alt='封面'
				:class='$style.cover'
			>
		</RouterLink>

		<h2 :class='$style.title'>
			<RouterLink :to='articleLink(item)'>
				{{ item.title }}
			</RouterLink>
		</h2>

		<div :class='$style.summary'>
			{{ item.summary }}
		</div>

		<div :class='$style.category'>
			<span
				v-for='c of item.categories'
				:key='c.id'
				class='tag-group-item'
			>
				{{ c.name }}
			</span>
		</div>

		<div :class='$style.meta'>
			<span title='发表于' :class='$style.metaItem'>
				<EditIcon/>
				<RelativeTime :value='item.create'/>
			</span>
			<span title='浏览数' :class='$style.metaItem'>
				<EyeIcon/>{{ item.viewCount }}
			</span>
			<span title='评论数' :class='$style.metaItem'>
				<ChatIcon/>{{ item.discussionCount }}
			</span>
		</div>
	</article>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import ChatIcon from "bootstrap-icons/icons/chat-dots.svg?sfc";
import { RelativeTime } from "@kaciras-blog/uikit";
import { articleLink } from "@/common.ts";

interface PreviewItemProps {
	item: any;
}

defineProps<PreviewItemProps>();
</script>

<style module lang="less">
@import "../../css/imports.less";

.container {
	composes: segment from global;

	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;

	padding: 15px 0;

	@media screen and (max-width: @length-screen-mobile) {
		padding: 10px 30px;
		grid-auto-flow: row;
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
	composes: compact from global;

	font-size: 1.5em;
	font-weight: 500;

	@media screen and (max-width: @length-screen-mobile) {
		text-align: center;
	}
}

.category {
	composes: tag-group from global;
}

.meta {
	color: @color-text-minor;
}

.metaItem {
	margin-right: 1em;

	& > svg {
		vertical-align: -4px;
		font-size: 18px;
		margin-right: 4px;
	}
}

@media screen and (min-width: @length-screen-mobile) {
	.coverLink {
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
</style>
