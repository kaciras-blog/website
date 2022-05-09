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
				<PaperPlaneIcon :class="$style.icon" title="发表于"/>
				<time>{{ localDateMinute(value.create) }}</time>

				<UpdateIcon :class="$style.icon" title="更新时间"/>
				<time>{{ localDateMinute(value.update) }}</time>

				<EyeIcon :class="$style.icon" title="浏览数"/>
				<span>{{ value.viewCount }}</span>

				<ChatIcon :class="$style.icon" title="评论数"/>
				<span>{{ value.discussionCount }}</span>
			</div>
		</div>

		<div :class="$style.buttons">
			<KxButton
				type="outline"
				color="primary"
				@click="addToCards"
			>
				创建卡片
			</KxButton>
			<KxButton
				type="outline"
				color="primary"
				@click="changeCategory"
			>
				更改分类
			</KxButton>
		</div>
		<div :class="$style.buttons">
			<KxButton
				type="outline"
				color="primary"
				@click="edit"
			>
				修改
			</KxButton>
			<KxButton
				v-if="value.deleted"
				color="info"
				type="outline"
				@click="updateDeleteState(false)"
			>
				恢复
			</KxButton>
			<KxButton
				v-else
				type="outline"
				color="dangerous"
				@click="updateDeleteState(true)"
			>
				删除
			</KxButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import api from "@/api";
import { KxButton, useDialog } from "@kaciras-blog/uikit";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import UpdateIcon from "@material-design-icons/svg/filled/update.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import ChatIcon from "bootstrap-icons/icons/chat-dots.svg?sfc";
import { articleLink, localDateMinute } from "@/common";
import { errorMessage } from "@/utils";
import SelectCategoryDialog from "@/components/SelectCategoryDialog.vue";
import CardsConsole from "./CardsConsole.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const dialog = useDialog();
const sendMessage = inject<(target: any, data: unknown) => void>("sendMessage")!;

const props = defineProps(["value"]);

function edit() {
	return api.draft.fromArticle(props.value.id)
		.then(d => router.push("/edit/" + d.id))
		.catch(err => console.log(err));
}

function addToCards() {
	const { value } = props;
	sendMessage(CardsConsole, {
		picture: value.cover,
		description: value.summary,
		name: value.title,
		link: articleLink(value),
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

.icon {
	margin-right: 4px;
	font-size: 18px;
	vertical-align: sub;

	&:not(:first-child) {
		margin-left: 10px;
	}
}
</style>
