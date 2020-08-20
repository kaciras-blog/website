<template>
	<kx-base-dialog :title='draft.articleId ? "更新文章": "发表文章"'>
		<form :class="$style.body">

			<div :class="$style.category" class="segment">
				<span class="label">发布到：</span>

				<div v-if="category" :class="$style.input">
					<img
						class="small head"
						:src="category.cover"
						alt="分类图标"
					>
					<h3 :class="$style.name">{{category.name}}</h3>
				</div>
				<div v-else :class="$style.input"></div>

				<kx-button @click="selectCategory">选择分类</kx-button>
			</div>

			<label for="urlTitle" :class="$style.block_label">
				URL里的标题（尽量使用英文）
			</label>
			<div :class="$style.field">
				<input
					v-model="urlTitle"
					id="urlTitle"
					title="URL，尽量用英文"
					:placeholder="current.title"
					:class="$style.input"
				>
				<kx-button @click="replace">替换空格</kx-button>
			</div>

			<kx-check-box v-model="destroy">发表后删除草稿</kx-check-box>
		</form>

		<kx-standard-dialog-buttons @confirm="accept"/>
	</kx-base-dialog>
</template>

<script>
import api from "@/api";
import SelectCategoryDialog from "@/components/SelectCategoryDialog";
import { errorMessage } from "@/utils";

export default {
	name: "PublishDialog",
	props: {
		draft: Object,
		current: Object,
	},
	data: () => ({
		urlTitle: "",
		category: null,
		destroy: false,
	}),
	methods: {
		selectCategory() {
			this.$dialog.show(SelectCategoryDialog).onConfirm(data => this.category = data);
		},
		replace() {
			this.urlTitle = this.urlTitle.replace(/ +/g, "-");
		},
		async accept() {
			const { draft, current } = this;
			try {
				const data = Object.assign({}, current);
				data.keywords = current.keywords.split(" ");
				data.draftId = draft.id; // 文章API里是draftId
				data.destroy = this.destroy;

				let id = draft.articleId;
				let article;

				if (id) {
					article = await api.article.update(id, data);
				} else if (!this.category) {
					return this.$dialog.alertError("发表失败", "必须选择一个分类");
				} else {
					data.category = this.category.id;
					data.urlTitle = this.urlTitle || data.title;
					article = await api.article.publish(data);
				}

				this.$dialog.confirm(article);
			} catch (e) {
				this.$dialog.alertError("发表失败", errorMessage(e));
			}
		},
	},
};
</script>

<style module lang="less">
/*@import "../../css/imports";*/

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
	vertical-align: middle;
}

.block_label {
	display: block;
	margin-bottom: 8px;
}
</style>
