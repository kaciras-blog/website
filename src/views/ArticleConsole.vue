<template>
<div>

	<div class="buttons">
		<button class="primary" @click="newArticle"><i class="fa fa-edit"></i>新文章</button>
	</div>

	<div class="panel">
		<span class="flex center-content" v-if="allLoaded && articles.length===0">没有找到文章,去写一篇吧~</span>

		<div class="segment"
			 :key="A.id"
			 v-for="A in articles">

			<img class="cover-lite" :src="'/image/' + A.cover">
			<div class="flex vertical expansion between">
				<div class="flex margin-horiz">
					<span class="pad-red" v-if="A.deleted">已删除</span>
					<h3 class="compact">{{A.title}}</h3>
				</div>
				<div class="flex margin">
					<span class="tag" v-for="C in A.categories">{{C.name}}</span>
				</div>
				<div class="flex margin-horiz minor-text">
					<span><i class="far fa-edit"></i>{{A.create}}</span>
					<span><i class="fas fa-sync"></i>{{A.update}}</span>
					<span><i class="fa fa-eye"></i>{{A.viewCount}}</span>
					<span><i class="fas fa-comment-dots"></i>{{A.discussionCount}}</span>
				</div>
			</div>
			<div class="flex vertical margin-vert">
				<a class="border primary square button" @click="editArticle(A.id)">修改</a>
				<button class="border dangerous square" @click="deleteArticle(A.id)">删除</button>
			</div>
		</div>

		<sk-fading-circle v-if="loading"></sk-fading-circle>
	</div>
</div>
</template>

<script>
import api from "../apis";
import pagerButtons from "../components/ButtonPager";

export default {
	name: "ArticleConsole",
	components: {pagerButtons},
	data() {
		return {
			loading: true,
			allLoaded: false,
			articles: [],
		};
	},
	methods: {
		editArticle(aid) {
			api.draft.createFromPost(aid)
				.then(id => window.location.href = "/edit/" + id)
				.catch(err => console.log(err));
		},
		deleteArticle(id) {
			api.article.deleteOne(id)
				.then(() => deleteOn(this.articles, a => a.id === id))
				.catch(err => this.$dialog.messageBox({
					title: "删除文章",
					type: "error",
					content: errMsg(err),
				}));
		},
		newArticle() {
			api.draft.createNew()
				.then(id => window.location.href = "/edit/" + id)
				.catch(err => console.log(err));
		},
		loadArticles() {
			this.loading = true;
			const len = this.articles.length;

			api.article.getList(0, len === 0 ? 0 : this.articles[len - 1]["id"], 10, "ALL")
				.then(r => {
					this.articles = r;
					this.allLoaded = r.length === 0;
					this.loading = false;
				})
				.catch(err => this.$dialog.messageBox({
					title: "加载文章失败",
					type: "error",
					content: "原因：" + err,
				}));
		},
	},
	conponents: {
		pagerButtons,
	},
	created() {
		this.loadArticles();
	},
};
</script>

<style scoped>
.pad-red {
	border-radius: .3rem;
	background-color: #ed575a;
	color: whitesmoke;
	padding: .2rem .3rem;
}

.buttons {
	margin-bottom: 1rem;
}
</style>
