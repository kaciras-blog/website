<template>
	<div :class="$style.container">
		<img :class="$style.cover" :src="value.cover" alt="封面">

		<div :class="$style.info_section">

			<div :class="$style.header">
				<span v-if="value.deleted" :class="$style.removed">
					已删除
				</span>
				<h3>{{ value.title }}</h3>
			</div>

			<div :class="$style.tag_group">
				<span
					v-for="category of value.categories"
					:key="category.id"
					class="tag-group-item"
				>
					{{ category.name }}
				</span>
			</div>

			<div :class="$style.attrs">
				<i class="far fa-edit" title="发表于"></i>
				<time>{{ localDateMinute(value.create) }}</time>

				<i class="fas fa-sync" title="最后更新"></i>
				<time>{{ localDateMinute(value.update) }}</time>

				<i class="fa fa-eye" title="浏览数"></i>
				<span>{{ value.viewCount }}</span>

				<i class="fas fa-comment-dots" title="评论数"></i>
				<span>{{ value.discussionCount }}</span>
			</div>
		</div>

		<div :class="$style.buttons">
			<kx-button
				class="primary outline"
				@click="addToCards"
			>
				创建卡片
			</kx-button>
			<kx-button
				class="primary outline"
				@click="changeCategory"
			>
				更改分类
			</kx-button>
		</div>
		<div :class="$style.buttons">
			<kx-button
				class="primary outline"
				@click="edit"
			>
				修改
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

<script setup lang="ts">
import { inject } from "vue";
import api from "@/api";
import { useDialog } from "@kaciras-blog/uikit";
import { articleLink, localDateMinute } from "@/blog-plugin";
import { errorMessage } from "@/utils";
import SelectCategoryDialog from "@/components/SelectCategoryDialog.vue";
import CardsConsole from "./CardsConsole.vue";

const dialog = useDialog();
const sendMessage = inject<Function>("sendMessage")!;

const props = defineProps(["value"]);

function edit() {
	return api.draft.fromArticle(props.value.id)
		.then(id => window.location.href = "/edit/" + id)
		.catch(err => console.log(err));
}

function addToCards() {
	sendMessage(CardsConsole, {
		picture: props.value.cover,
		name: props.value.title,
		link: articleLink(props.value),
		description: props.value.summary,
	});
}

function updateDeleteState(deletion: boolean) {
	const { value } = props;
	api.article.changeDeletion(value.id, deletion)
		.then(() => value.deleted = deletion)
		.catch(e => dialog.alertError("设置失败", errorMessage(e)));
}

async function changeCategory() {
	const target: any = await dialog.show(SelectCategoryDialog).confirmPromise;
	api.article.changeCategory(props.value.id, target.id)
		.catch(e => dialog.alertError("设置失败", errorMessage(e)));
}
</script>

<style module lang="less">
@import "../../css/imports";

@cover-width: 10rem;

.container {
	display: flex;
}

.cover {
	width: @cover-width;
	height: @cover-width * 0.75;
}

.buttons {
	composes: vertical-btn-group from global;
	margin-left: 10px;
}

.info_section {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 1rem;
}

.header {
	flex: 1;
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
	padding: .3em .5em;
	margin-right: .5em;

	background-color: #E42B21;
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
