<template>
	<kx-base-dialog :draggable="true">
		<h3 slot="title">{{ archive.articleId ? "更新文章": "发表文章" }}</h3>

		<div class="body">

			<div class="category segment">
				<span class="label">发表到：</span>

				<div class="selected" v-if="category">
					<img class="small head"
						 :src="category.cover"
						 alt="分类图标">
					<h3 class="compact">{{category.name}}</h3>
				</div>
				<div class="selected" v-else></div>

				<kx-button @click="selectCategory">选择分类</kx-button>
			</div>

			<label>
				文章的URL，发表后不能修改，尽量使用英文，默认与标题相同
				<input title="URL，尽量用英文"
					   v-model="url"
					   :placeholder="metadata.title"/>
			</label>
		</div>

		<div slot="footer" class="footer btn-group">
			<kx-button @click="cancel">取消</kx-button>
			<kx-task-button class="primary" :on-click="accept">确定</kx-task-button>
		</div>
	</kx-base-dialog>
</template>

<script>
import api from "../../api";
import SelectCategoryDialog from "../../components/SelectCategoryDialog";
import { errorMessage } from "../../utils";

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
	}),
	methods: {
		selectCategory () {
			this.$dialog.show(SelectCategoryDialog.name).then(res => {
				if(res) this.category = res;
			});
		},
		async accept () {
			const { archive, metadata, content } = this;
			try {
				const data = Object.assign({}, metadata);
				data.content = content;
				data.keywords = data.keywords.split(" ");
				data.draftId = archive.id; // 文章API里是draftId

				let article = archive.articleId;

				if (article) {
					await api.article.update(article, data);
				} else {
					if (!this.category) {
						this.$dialog.messageBox("发表失败", "请选择分类", "error");
						return;
					}
					data.category = this.category.id;
					data.urlTitle = this.url.length ? this.url : data.title;

					article = (await api.article.publish(data)).substring("/articles/".length);
				}
				this.$dialog.close();
				this.$router.push(`/article/${article}`);
			} catch (e) {
				this.$dialog.messageBox("发表失败", errorMessage(e), "error");
			}
		},
		cancel () {
			this.$dialog.close(false);
		},
	},
};
</script>

<style scoped lang="less">
@import "../../css/Imports";

.body {
	width: 480px;
}

.category {
	display: flex;
	align-items: center;
	margin-bottom: 1rem;

	& > .label {
		word-break: keep-all;
		font-size: 1.3rem;
	}
}

.selected {
	flex-grow: 1;
	display: contents;

	& > h3 {
		display: inline-block;
		margin: 0 .5rem;
		.ellipsis;
	}
}

input {
	margin-top: .4rem;
	width: 100%;
}

.footer{
	text-align: right;
	padding-right: 1rem;
}
</style>
