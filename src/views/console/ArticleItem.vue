<template>
	<article :class='$style.container'>
		<img :class='$style.cover' :src='value.cover' alt='封面'>

		<header :class='$style.header'>
			<span v-if='value.deleted' :class='$style.removed'>已删除</span>
			<h3 class='compact'>{{ value.title }}</h3>
		</header>

		<div class='tag-group'>
			<span
				v-for='category of value.categories'
				:key='category.id'
				class='tag-group-item'
			>
				{{ category.name }}
			</span>
		</div>

		<div :class='$style.attributes'>
			<PaperPlaneIcon :class='$style.icon' title='发表于'/>
			<RelativeTime :value='value.create' :threshold='0'/>

			<UpdateIcon :class='$style.icon' title='更新时间'/>
			<RelativeTime :value='value.update' :threshold='0'/>

			<EyeIcon :class='$style.icon' title='浏览数'/>
			<span>{{ value.viewCount }}</span>

			<ChatIcon :class='$style.icon' title='评论数'/>
			<span>{{ value.discussionCount }}</span>
		</div>

		<KxButton
			type='outline'
			color='primary'
			@click='addToCards'
		>
			创建卡片
		</KxButton>
		<KxButton
			type='outline'
			color='primary'
			@click='changeCategory'
		>
			更改分类
		</KxButton>
		<KxButton
			type='outline'
			color='primary'
			@click='edit'
		>
			修改
		</KxButton>
		<KxButton
			v-if='value.deleted'
			color='info'
			type='outline'
			@click='updateDeleteState(false)'
		>
			恢复
		</KxButton>
		<KxButton
			v-else
			type='outline'
			color='dangerous'
			@click='updateDeleteState(true)'
		>
			删除
		</KxButton>
	</article>
</template>

<script setup lang="ts">
import { inject } from "vue";
import api from "@/api";
import { KxButton, RelativeTime, useDialog } from "@kaciras-blog/uikit";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import UpdateIcon from "@material-design-icons/svg/filled/update.svg?sfc";
import EyeIcon from "bootstrap-icons/icons/eye-fill.svg?sfc";
import ChatIcon from "bootstrap-icons/icons/chat-dots.svg?sfc";
import { articleLink } from "@/common";
import { errorMessage } from "@/utils";
import SelectCategoryDialog from "@/components/SelectCategoryDialog.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const dialog = useDialog();
const sendMessage = inject<(target: any, data: unknown) => void>("sendMessage")!;

const props = defineProps(["value"]);

function edit() {
	return api.draft.fromArticle(props.value.id)
		.then(d => router.push("/edit/draft/" + d.id))
		.catch(err => console.log(err));
}

function addToCards() {
	const { value } = props;
	sendMessage("card", {
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

@cover-width: 13.5rem;

.container {
	display: grid;
	grid-template-columns: auto 1fr auto auto;
	grid-template-rows: auto  auto 1fr;
	gap: 12px;
	align-items: end;
	grid-auto-flow: column;
}

.cover {
	grid-row: 1/4;
	width: @cover-width;
	height: @cover-width * 0.5625;
}

.header {
	align-self: start;
}

.removed {
	border-radius: .3rem;
	padding: .3rem .4rem;
	margin-right: .5em;

	background-color: #E42B21;
	color: whitesmoke;

	& + h3 {
		display: inline;
	}
}

.attributes {
	composes: minor-text from global;
	grid-row: 3;
	grid-column: 2/5;
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
