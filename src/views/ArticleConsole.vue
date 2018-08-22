<template>
<div class="flex vertical margin-vert">

	<div class="flex margin-horiz">
		<a class="primary button" @click="newArticle()"><i class="fa fa-edit"></i>新文章</a>
	</div>

	<div class="panel">
		<span class="flex center-content" v-if="allLoaded && articles.length===0">没有找到文章,去写一篇吧~</span>

		<div class="flex segment margin-horiz" v-for="A in articles">
			<img class="cover-lite" :src="'/image/' + A.cover">
			<div class="flex vertical expansion between">
				<div class="flex margin-horiz">
					<span class="pad-red" v-if="A.deleted">已删除</span>
					<h3 class="compact">{{A.title}}</h3>
				</div>
				<div class="flex margin">
					<span v-for="C in A.categories" class="tag">{{C.name}}</span>
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

		<div v-if="loading" class="sk-fading-circle">
			<div class="sk-circle1 sk-circle"></div>
			<div class="sk-circle2 sk-circle"></div>
			<div class="sk-circle3 sk-circle"></div>
			<div class="sk-circle4 sk-circle"></div>
			<div class="sk-circle5 sk-circle"></div>
			<div class="sk-circle6 sk-circle"></div>
			<div class="sk-circle7 sk-circle"></div>
			<div class="sk-circle8 sk-circle"></div>
			<div class="sk-circle9 sk-circle"></div>
			<div class="sk-circle10 sk-circle"></div>
			<div class="sk-circle11 sk-circle"></div>
			<div class="sk-circle12 sk-circle"></div>
		</div>

	</div>
</div>
</template>

<script>
import api from "../apis";
import pagerButtons from "../components/ButtonPager";

function loadArticles() {
	this.loading = true;
	const len = this.articles.length;

	api.article.getList(0, len === 0 ? 0 : list[len - 1]["id"], 10, "ALL")
		.then(r => {
			this.articles = r;
			this.allLoaded = r.length === 0;
			this.loading = false;
		})
		.catch(err => console.log(err));
}

export default {
	components: {pagerButtons},
	name: "article-page",
	methods: {
		editArticle(aid) {
			api.draft.createFromPost(aid)
				.then(id => window.location.href = "/edit/" + id)
				.catch(err => console.log(err));
		},
		deleteArticle(id) {
			api.article.deleteOne(id)
				.then(() => deleteOn(this.articles, a => a.id === id))
				.catch(err => this.$messageBox("删除文章", errMsg(err), "error"));
		},
		newArticle() {
			api.draft.createNew()
				.then(id => window.location.href = "/edit/" + id)
				.catch(err => console.log(err));
		},
		loadArticles,
	},
	data() {
		return {
			loading: true,
			allLoaded: false,
			articles: [],
		};
	},
	conponents: {
		pagerButtons,
	},
	created: loadArticles,
};
</script>

<style scoped>
.pad-red {
	border-radius: .3rem;
	background-color: #ed575a;
	color: whitesmoke;
	padding: .2rem .3rem;
}
</style>
