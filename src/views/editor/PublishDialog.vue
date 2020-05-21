<template>
	<kx-base-dialog :title='archive.articleId ? "更新文章": "发表文章"'>

		<div :class="$style.body">
			<div :class="$style.category" class="segment">
				<span class="label">发表到：</span>

				<div v-if="category" :class="$style.selected">
					<img
						class="small head"
						:src="category.cover"
						alt="分类图标"
					>
					<h3 :class="$style.name">{{category.name}}</h3>
				</div>

				<div v-else :class="$style.selected"></div>

				<kx-button
					:class="$style.select_button"
					@click="selectCategory"
				>
					选择分类
				</kx-button>
			</div>

			<label>
				文章的URL（发表后不能修改，尽量使用英文）
				<input
					v-model="url"
					title="URL，尽量用英文"
					:class="$style.input"
					:placeholder="metadata.title"
				>
			</label>

			<kx-check-box v-model="destroy"> 发表后删除草稿</kx-check-box>
		</div>

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
		archive: Object,
		metadata: Object,
		content: String,
	},
	data: () => ({
		url: "",
		category: null,
		destroy: true,
	}),
	methods: {
		selectCategory() {
			this.$dialog.show(SelectCategoryDialog).onConfirm(data => this.category = data);
		},
		async accept() {
			const { archive, metadata, content } = this;
			try {
				const data = Object.assign({}, metadata);
				data.content = content;
				data.keywords = data.keywords.split(" ");
				data.draftId = archive.id; // 文章API里是draftId
				data.destroy = this.destroy;

				let id = archive.articleId;
				let returnUrl;

				if (id) {
					// TODO：returnUrl 不一致
					await api.article.update(id, data);
					returnUrl = id;
				} else if (!this.category) {
					return this.$dialog.alertError("发表失败", "必须选择一个分类");
				} else {
					data.category = this.category.id;
					data.urlTitle = this.url.length ? this.url : data.title;
					returnUrl = await api.article.publish(data);
				}

				this.$dialog.confirm(returnUrl);
			} catch (e) {
				this.$dialog.alertError("发表失败", errorMessage(e));
			}
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.body {
	width: 480px;
}

.category {
	display: flex;
	align-items: center;
	margin-bottom: 2rem;

	& > .label {
		word-break: keep-all;
		font-size: 1.3rem;
	}
}

.selected {
	flex-grow: 1;
	display: contents;
}

.name {
	composes: compact ellipsis from global;

	display: inline-block;
	padding: 0 .5rem;
}

.select_button {
	margin-left: auto;
}

.input {
	margin: 5px 0 14px 0;
	width: 100%;
}

.footer {
	text-align: right;
	padding-right: 1rem;
}
</style>
