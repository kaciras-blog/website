<template>
	<article>
		<header class="title segment">
			<h1>{{title}}</h1>
			<p>发布时间
				<time>{{create}}</time>
			</p>
			<p>最后更新
				<time>{{update}}</time>
			</p>
			<div>
				关键词：<span class="keyword" v-for="kw in keywords" :key="kw">{{kw}}</span>
			</div>
		</header>
		<div class="markdown segment" v-html="contentHtml"></div>
	</article>
</template>

<script>
import convertor from "../markdown/markdown-convertor";

export default {
	name: "ArticleView",
	props: ["title", "create", "update", "keywords", "content"],
	computed: {
		contentHtml() {
			if (!this.content) {
				return "";
			}
			return convertor.render(this.content);
		},
	},
};
</script>

<style lang="less">
@import "../css/ToBeImpoert";

.title {
	text-align: center;
	& > h1 {
		font-size: 1.5rem;
	}
}

.keyword {
	margin-right: .3em;
}
</style>
