<template>
	<div class="article">
		<img class="cover" :src="value.cover" alt="文章封面">

		<div>
			<span class="red note" v-if="value.deleted">已删除</span>
			<h3 class="compact">{{value.title}}</h3>
		</div>

		<div class="info">
			<div class="tag-group">
				<span v-for="c in value.cpath" :key="c.id">{{c.name}}</span>
			</div>

			<div class="minor-text">
				<i class="far fa-edit" title="发表于"></i>
				<time>{{value.create}}</time>

				<i class="fas fa-sync" title="最后更新"></i>
				<time>{{value.update}}</time>

				<i class="fas fa-comment-dots" title="评论数"></i>
				<span>{{value.dcnt}}</span>

				<i class="fa fa-eye" title="浏览数"></i>
				<span>{{value.vcnt}}</span>
			</div>
		</div>

		<div class="vertical-btn-group ops">
			<kx-button
				class="primary outline"
				@click="edit">
				修改
			</kx-button>
			<kx-button
				class="second outline"
				@click="move">
				移动
			</kx-button>
			<kx-button
				v-if="!value.deleted"
				class="dangerous outline"
				@click="delete">
				删除
			</kx-button>
		</div>
	</div>
</template>

<script>
import api from "../../api";
import { deleteOn, errorMessage } from "../../utils";

export default {
	name: "ArticleConsoleItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	methods: {
		edit() {
			api.draft.createFromPost(this.value.id)
				.then(id => window.location.href = "/edit/" + id)
				.catch(err => console.log(err));
		},
		move() {

		},
		delete() {
			const id = this.value.id;
			api.article.deleteOne(id)
				.then(() => deleteOn(this.articles, a => a.id === id))
				.catch(err => this.$dialog.messageBox("删除文章", errorMessage(err), "error"));
		},
	},
};
</script>

<style scoped lang="less">
@import "../../css/ToBeImpoert";

.article {
	display: grid;
	grid-template-areas: "img title buttons" "img meta  buttons";
	grid-template-columns: 8rem 1fr auto;
	grid-template-rows: 3.5rem 3.5rem;
	grid-column-gap: 1rem;
}

.cover {
	grid-area: img;
	.size(100%, 100%);
}

.ops {
	grid-area: buttons;

	& > .kx-btn {
		display: block;
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

.tag-group {
	margin-bottom: 1rem;
}
</style>
