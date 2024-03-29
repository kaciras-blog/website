<template>
	<KxBaseDialog :title='draft.articleId ? "更新文章": "发表文章"'>
		<form :class='$style.body'>

			<div :class='$style.category' class='segment'>
				<span class='label'>分类：</span>

				<template v-if='category'>
					<img
						class='small head'
						:src='category.cover'
						alt='分类图标'
					>
					<h3 :class='$style.name'>{{ category.name }}</h3>
				</template>

				<KxButton
					type='outline'
					:style='{ marginLeft: "auto" }'
					@click='selectCategory'
				>
					选择分类
				</KxButton>
			</div>

			<label for='urlTitle' :class='$style.block_label'>
				URL里的标题（尽量使用英文）
			</label>
			<div :class='$style.field'>
				<input
					v-model='urlTitle'
					id='urlTitle'
					title='URL，尽量用英文'
					:placeholder='current.title'
					:class='$style.input'
				>
				<KxButton
					type='outline'
					@click='replace'
				>
					替换空格
				</KxButton>
			</div>

			<KxCheckBox v-model='destroy'>发表后删除草稿</KxCheckBox>
		</form>

		<KxDialogButtons @accept='accept' @cancel='dialog.close'/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { KxBaseDialog, KxButton, KxCheckBox, KxDialogButtons, useDialog } from "@kaciras-blog/uikit";
import api, { Category } from "@/api/index.ts";
import { errorMessage } from "@/utils.ts";
import SelectCategoryDialog from "@/components/SelectCategoryDialog.vue";

interface PublishDialogProps {
	draft: any;
	current: any;
}

const props = defineProps<PublishDialogProps>();

const dialog = useDialog();

const urlTitle = ref("");
const category = ref<Category | null>(null);
const destroy = ref(false);

function selectCategory() {
	dialog.show<Category>(SelectCategoryDialog).onConfirm(data => category.value = data);
}

function replace() {
	urlTitle.value = urlTitle.value.replace(/ +/g, "-");
}

async function accept() {
	const { draft, current } = props;
	try {
		const data = Object.assign({}, current);
		data.keywords = []; // TODO: 关键词已废弃
		data.draftId = draft.id; // 文章 API 里是 draftId。
		data.destroy = destroy.value;

		let id = draft.articleId;
		let article;

		if (id) {
			article = await api.article.update(id, data);
		} else if (!category.value) {
			return dialog.alertError("发表失败", "必须选择一个分类");
		} else {
			data.category = category.value.id;
			data.urlTitle = urlTitle.value || data.title;
			article = await api.article.publish(data);
		}

		dialog.confirm(article);
	} catch (e) {
		dialog.alertError("发表失败", errorMessage(e));
	}
}
</script>

<style module lang="less">
.body {
	width: 32rem;
}

.field {
	display: flex;
	margin-bottom: 1em;
}

.input {
	margin-right: 1em;
	flex: 1;
}

.category {
	composes: field;
	align-items: center;
	margin-bottom: 2rem;

	& > .label {
		word-break: keep-all;
		font-size: 1.3rem;
	}
}

.name {
	composes: compact ellipsis from global;

	display: inline-block;
	padding: 0 .5rem;
}

.block_label {
	display: block;
	margin-bottom: 8px;
}
</style>
