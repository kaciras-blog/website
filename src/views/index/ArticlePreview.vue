<template>
	<div :class="$style.container">
		<router-link
			:to="item | articleLink"
			tabindex="-1"
			:class="$style.cover">
			<img :src="item.cover" class="cram">
		</router-link>

		<router-link
			:to="item | articleLink"
			:class="$style.title">
			{{item.title}}
		</router-link>

		<span :class="$style.summary">{{item.summary}}</span>

		<div :class="$style.keywords">
			关键词：
			<span v-for="kw in item.keywords"
				  :key="kw"
				  :class="$style.keyword">{{kw}}</span>
		</div>

		<div class="tag-group"
			 :class="$style.category">
			<router-link
				v-for="cat in item.cpath"
				:key="cat.id"
				:to="'/category/' + cat.name">
				{{cat.name}}
			</router-link>
		</div>

		<div class="minor-text" :class="$style.meta">
			<span title="发表于" class="full-time meta">
				<i class="fa fa-edit"></i>
				<time>{{item.create}}</time>
			</span>

			<span v-if="showUpdate(item)"
				  title="最后更新"
				  class="hide-mobile meta">
				<i class="fas fa-sync"></i>
				<time>{{item.update}}</time>
			</span>

			<span title="时间" class="show-mobile meta">
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
	</div>
</template>

<script>
export default {
	name: "ArticlePreview",
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	filters: {
		shortTime(article) {
			const time = article.create !== article.update
				? article.update
				: article.create;
			return time.substring(5);
		},
	},
	methods: {
		showUpdate(item) {
			return item["create"] !== item["update"];
		},
	},
};
</script>


<style module lang="less">
@import "../../css/ToBeImport.less";

.container{
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 1rem;

	padding: 1rem;
	margin: 1rem 0;
	border-bottom: solid 1px @color-border;

	@media screen and (max-width: (@length-screen-mobile - 1px)) {
		text-align: center;
		& > * {
			justify-self: center;
			justify-content: center;
		}
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
	margin-left: .3em;
	margin-right: .3em;
}

@media screen and (min-width: @length-screen-mobile) {
	.cover {
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
}

.title {
	font-size: 1.5em;
	font-weight: 500;
}
</style>
