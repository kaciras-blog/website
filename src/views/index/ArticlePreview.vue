<template>
	<div class="article-preview segment">
		<router-link :to="item | articleLink">
			<img :src="item.cover" class="cover-small">
		</router-link>

		<router-link :to="item | articleLink" class="title">{{item.title}}</router-link>

		<span>{{item.summary}}</span>
		<div>关键词：<span v-for="kw in item.keywords" :key="kw" class="keyword">{{kw}}</span></div>

		<div class="tag-group">
			<router-link
				v-for="cat in item.cpath"
				:key="cat.id"
				:to="'/category/' + cat.name">
				{{cat.name}}
			</router-link>
		</div>

		<div class="minor-text">
			<span title="发表于" class="full-time meta">
				<i class="fa fa-edit"></i>
				<time>{{item.create}}</time>
			</span>

			<span title="最后更新" v-if="showUpdate(item)" class="full-time meta">
				<i class="fas fa-sync"></i>
				<time>{{item.update}}</time>
			</span>

			<span title="时间" class="short-time meta">
				<i class="far fa-clock"></i>
				<time>{{item | shortTime}}</time>
			</span>

			<span title="评论数" class="meta"><i class="fas fa-comment-dots"></i>{{item.dcnt}}</span>
			<span title="浏览数" class="meta"><i class="fa fa-eye"></i>{{item.vcnt}}</span>
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
		reserve(array) {
			const newArr = array.slice(0);
			newArr.reverse();
			return newArr;
		},
		showUpdate(item) {
			return item["create"] !== item["update"];
		},
	},
};
</script>

<style lang="less">
@import "../../css/ToBeImport.less";

.article-preview {
	display: grid;
	grid-template-rows: auto;
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

	& > *:nth-child(1) {
		width: 10rem;
		height: 9rem;
	}

	@media screen and (min-width: @length-screen-mobile) {
		padding-left: 0;
		padding-right: 0;
		grid-template-rows: auto auto;
		grid-template-columns: 10rem auto;

		& > *:nth-child(1) {
			grid-area: ~"1/1/4/2";
		}

		& > *:nth-child(2) {
			grid-area: ~"1/2/2/2";
		}

		& > *:nth-child(3) {
			grid-area: ~"2/2/3/-1";
		}

		& > *:nth-child(4) {
			grid-area: ~"3/2/4/3";
			align-self: end;
		}

		& > *:nth-child(5) {
			grid-area: ~"4/1/5/3";
		}

		& > *:nth-child(6) {
			grid-area: ~"5/1/6/3";
			justify-self: right;
		}
	}
}

.full-time {
	display: none;
	@media screen and (min-width: @length-screen-mobile) {
		display: initial;
	}
}

@media screen and (min-width: @length-screen-mobile) {
	.short-time {
		display: none;
	}
}

.cover-small {
	width: 100%;
	height: 100%;
}

.preview-footer {
	align-items: center;
	margin: 1em 0;
}

.keyword {
	margin-left: .3em;
	margin-right: .3em;
}
</style>

<style scoped lang="less">
.title {
	font-size: 1.5em;
	font-weight: 500;
}
</style>
