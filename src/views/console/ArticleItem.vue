<template>
	<div :class="$style.article">
		<img :class="$style.cover" :src="value.cover" alt="封面">

		<div>
			<span v-if="value.deleted" :class="$style.removed">已删除</span>
			<h3 class="compact">{{value.title}}</h3>
		</div>

		<div :class="$style.info_section">
			<div :class="$style.tag_group">
				<span
					v-for="category of value.categories"
					:key="category.id"
					class="tag-group-item"
				>
					{{category.name}}
				</span>
			</div>

			<div :class="$style.attrs">
				<i class="far fa-edit" title="发表于"></i>
				<time>{{value.create | localDateMinute}}</time>

				<i class="fas fa-sync" title="最后更新"></i>
				<time>{{value.update | localDateMinute}}</time>

				<i class="fa fa-eye" title="浏览数"></i>
				<span>{{value.viewCount}}</span>

				<i class="fas fa-comment-dots" title="评论数"></i>
				<span>{{value.discussionCount}}</span>
			</div>
		</div>

		<div :class="$style.buttons">
			<kx-button
				class="primary outline"
				@click="edit"
			>
				修改
			</kx-button>
			<kx-button
				class="primary outline"
				@click="addToCards"
			>
				创建卡片
			</kx-button>

			<kx-button
				v-if="value.deleted"
				class="info"
				@click="updateDeleteState(false)"
			>
				恢复
			</kx-button>
			<kx-button
				v-else
				class="dangerous"
				@click="updateDeleteState(true)"
			>
				删除
			</kx-button>
		</div>
	</div>
</template>

<script>
import api from "@/api";
import { articleLink } from "@/blog-plugin";
import { errorMessage } from "@/utils";
import CardsConsole from "./CardsConsole";

export default {
	name: "ArticleItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	inject: ["sendMessage"],
	methods: {
		edit() {
			return api.draft.fromArticle(this.value.id)
				.then(id => window.location.href = "/edit/" + id)
				.catch(err => console.log(err));
		},
		addToCards() {
			this.sendMessage(CardsConsole, {
				picture: this.value.cover,
				name: this.value.title,
				link: articleLink(this.value),
				description: this.value.summary,
			});
		},
		updateDeleteState(deletion) {
			const { value } = this;
			api.article.updateDeletion(value.id, deletion)
				.then(() => value.deleted = deletion)
				.catch(e => this.$dialog.alertError("设置失败", errorMessage(e)));
		},
	},
};
</script>

<style module lang="less">
@import "../../css/Imports";

.article {
	display: grid;
	grid-template-areas: "img title buttons" "img meta  buttons";
	grid-template-columns: 8rem 1fr auto;
	grid-template-rows: 3.5rem 3.5rem;
	grid-column-gap: 1rem;
}

.cover {
	grid-area: img;
	.size(100%);
}

.buttons {
	composes: vertical-btn-group from global;
	grid-area: buttons;
}

.info_section {
	align-self: end;
}

.attrs {
	composes: minor-text from global;

	& > i {
		&:not(:first-of-type) {
			margin-left: 1rem;
		}

		margin-right: .2rem;
	}
}

.removed {
	border-radius: .3rem;
	padding: .2em .3em;
	margin-right: .5em;

	background-color: #ed575a;
	color: whitesmoke;

	& + h3 {
		display: inline;
	}
}

.tag_group {
	composes: tag-group from global;
	margin-bottom: 1rem;
}
</style>
