<template>
	<li :class="$style.container">
		<div :class="$style.main">
			<h3>{{ value.title }}</h3>

			<span :class="$style.time">
				<i class="fas fa-feather-alt"></i>
				<time>{{ localDateMinute(value.createTime) }}</time>
			</span>
			<span :class="$style.time">
				<i class="fas fa-sync-alt"></i>
				<time>{{ localDateMinute(value.updateTime) }}</time>
			</span>

			<span
				v-if="value.articleId"
				title="修改现有的文章"
				:class="$style.target"
			>
				<i class="fas fa-edit"/>
				{{ value.articleId }}
			</span>
		</div>

		<div class="btn-group">
			<kx-button
				:route="'/edit/' + value.id"
				class="primary outline"
			>
				编辑
			</kx-button>
			<kx-button
				class="dangerous outline"
				@click="deleteDraft"
			>
				删除
			</kx-button>
		</div>
	</li>
</template>

<script setup>
import { MessageBoxType, useDialog } from "@kaciras-blog/uikit";
import api from "@/api";
import { localDateMinute } from "@/blog-plugin";

const dialog = useDialog();

const props = defineProps(["value"]);

async function deleteDraft() {
	const dialog = dialog.alert({
		title: "删除草稿",
		content: "删除后不可恢复，是否确定？",
		type: MessageBoxType.Warning,
		showCancelButton: true,
	});

	await dialog.confirmPromise;
	await api.draft.remove(props.value.id);
	this.$emit("removed");
}
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: flex;
}

.main {
	flex: 1;
}

.target {
	padding: 5px 8px;
	border-radius: 4px;
	color: white;
	background: dodgerblue;
}

.time {
	color: @color-text-minor;
	padding-right: 15px;

	& > i {
		margin-right: 5px;
	}
}
</style>
