<template>
	<div>
		<div class="buttons">
			<button @click="newArticle"><i class="fa fa-edit"></i>新文章</button>
		</div>

		<div class="panel">
			<div v-for="A in articles"
				 :key="A.id"
				 class="article segment">

				<img :src="A.cover" alt="文章封面">
				<div>
					<span class="red note" v-if="A.deleted">已删除</span>
					<h3 class="compact">{{A.title}}</h3>
				</div>

				<div class="info">
					<div class="tag-group">
						<span v-for="c in A.cpath" :key="c.id">{{c.name}}</span>
					</div>
					<div class="minor-text">
						<i class="far fa-edit" title="发表于"></i><time>{{A.create}}</time>
						<i class="fas fa-sync" title="最后更新"></i><time>{{A.update}}</time>
						<i class="fas fa-comment-dots" title="评论数"></i><span>{{A.dcnt}}</span>
						<i class="fa fa-eye" title="浏览数"></i><span>{{A.vcnt}}</span>
					</div>
				</div>

				<button @click="editArticle(A.id)">修改</button>
				<button class="dangerous" @click="deleteArticle(A.id)">删除</button>
			</div>

			<span v-if="allLoaded && !articles.length">没有找到文章,去写一篇吧~</span>
			<sk-fading-circle v-if="loading"/>
		</div>
	</div>
</template>

<script>
import api from "../../apis";
import {deleteOn, errorMessage} from "../../utils";

export default {
	name: "ArticleConsole",
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
				.catch(err => this.$dialog.messageBox("删除文章", errorMessage(err), "error"));
		},
		newArticle() {
			api.draft.createNew()
				.then(id => this.$router.push("/edit/" + id))
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
	created() {
		this.loadArticles();
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.note {
	border-radius: .3rem;
	padding: .2em .3em;
	margin-right: .5em;

	&.red {
		background-color: #ed575a;
		color: whitesmoke;
	}

	& + h3 {
		display: inline;
	}
}

.panel {
	margin-bottom: 1rem;
	margin-top: 1rem;
}

.article {
	display: grid;
	grid-template-areas: "img title btn-1"
						 "img meta  btn-2";
	grid-template-columns: 8rem 1fr auto;
	grid-template-rows: 3.5rem 3.5rem;
	grid-column-gap: 1rem;

	& > img {
		grid-area: img;
		.size(100%, 100%);
	}
	& > button:nth-of-type(1) {
		grid-area: btn-1;
		align-self: start;
	}
	& > button:nth-of-type(2) {
		grid-area: btn-2;
		align-self: start;
	}
}

.info {
	align-self: end;
	& i {
		&:not(:first-of-type) {
			margin-left: 1rem;
		}
		margin-right: .2rem;
	}
}
.tag-group {
	margin-bottom: 1rem;
}
</style>
