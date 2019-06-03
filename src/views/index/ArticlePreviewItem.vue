<template>
	<li :class="$style.container">
		<router-link
			:to="item | articleLink"
			tabindex="-1"
			:class="$style.cover_link"
		>
			<img :src="item.cover"
				 alt="封面"
				 class="full-percent"
				 :class="$style.cover">
		</router-link>

		<h2 class="compact" :class="$style.title">
			<router-link :to="item | articleLink">{{item.title}}</router-link>
		</h2>

		<div :class="$style.summary">{{item.summary}}</div>

		<div :class="$style.keywords">
			<h4 class="inline compact">关键词：</h4>
			<ul class="inline list">
				<li v-for="kw in item.keywords"
					:key="kw"
					:class="$style.keyword">{{kw}}</li>
			</ul>
		</div>

		<div class="tag-group" :class="$style.category">
			<router-link
				v-for="c in item.cpath"
				:key="c.id"
				:to="c | categoryLink"
				class="tag-group-item">
				{{c.name}}
			</router-link>
		</div>

		<div class="minor-text" :class="$style.meta">

			<span title="发表于" class="hide-mobile full-time meta">
				<i class="fa fa-edit"></i>
				<time>{{item.create}}</time>
			</span>

			<span v-if="showUpdate" title="最后更新" class="hide-mobile meta">
				<i class="fas fa-sync"></i>
				<time>{{item.update}}</time>
			</span>

			<span title="最后更新" class="show-mobile meta">
				<i class="far fa-clock"></i>
				<time>{{item | shortTime}}</time>
			</span>

			<span title="评论数" class="meta">
				<i class="fas fa-comment-dots"></i>{{item.dcnt}}
			</span>

			<span title="浏览数" class="meta">
				<i class="fa fa-eye"></i>{{item.vcnt}}
			</span>
		</div>
	</li>
</template>

<script>
export default {
	name: "ArticlePreviewItem",
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	filters: {
		shortTime (article) {
			const time = article.create !== article.update
				? article.update
				: article.create;
			return time.substring(5);
		},
	},
	computed: {
		showUpdate () {
			return this.item.create !== this.item.update;
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports.less";

.container {
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 1rem;

	padding: 1rem;
	margin: 1rem 0;
	border-bottom: solid 1px @color-border;

	@media screen and (max-width: (@length-screen-mobile - 1px)) {
		text-align: center;
		justify-items: center;
	}

	@media screen and (min-width: @length-screen-mobile) {
		padding-left: 0;
		padding-right: 0;

		grid-template-rows: auto auto;
		grid-template-columns: 10rem auto;
		grid-template-areas: "cover title" "cover summary" "cover keywords" "category category" "meta meta";
	}
}

.keyword {
	display: inline;
	margin-left: .3em;
	margin-right: .3em;
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

	.keywords {
		grid-area: keywords;
		align-self: end;
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
	width: 10rem;
	height: 9rem;

	@media screen and (max-width: @length-screen-mobile) {
		width: 70vw;
		height: 63vw;
		border-radius: 10px;
	}
}

.title {
	font-size: 1.5em;
	font-weight: 500;
}

.summary {
	line-height: 1.5;
}
</style>
