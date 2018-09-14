<template>
	<article>
		<header class="title segment">
			<h1>{{title}}</h1>
			<p><span>发布时间</span><time>{{create}}</time></p>
			<p><span>最后更新</span><time>{{update}}</time></p>
			<div>
				<span>关键词：</span>
				<span v-for="kw in keywords" :key="kw" class="keyword">{{kw}}</span>
			</div>
		</header>
		<div class="markdown segment" v-html="html"></div>
	</article>
</template>

<script>
import KxMarkdown from "../markdown";

export default {
	name: "ArticleView",
	props: ["title", "create", "update", "keywords", "content"],
	computed:{
		// 过滤器不支持v-html
		html() {
			return KxMarkdown.renderHtml(this.content);
		},
	},
	mounted() {
		KxMarkdown.afterConvert();
	},
};
</script>

<style scoped lang="less">
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
