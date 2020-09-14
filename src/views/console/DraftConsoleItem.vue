<template>
	<li  :class="$style.container">
		<div :class="$style.main">
			<h3>{{value.title}}</h3>

			<span :class="$style.time">
				<i class="fas fa-feather-alt"></i>
				<time>{{value.createTime | localDateMinute}}</time>
			</span>
			<span :class="$style.time">
				<i class="fas fa-sync-alt"></i>
				<time>{{value.updateTime | localDateMinute}}</time>
			</span>

			<span
				v-if="value.articleId"
				title="修改现有的文章"
				:class="$style.target"
			>
				<i class="fas fa-edit"/>
				{{value.articleId}}
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

<script>
import { MessageBoxType } from "@kaciras-blog/uikit/src/dialog";
import api from "@/api";

export default {
	name: "DraftConsoleItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	methods: {
		async deleteDraft() {
			await this.$dialog.alert({
				title: "删除草稿",
				content: "删除后不可恢复，是否确定？",
				type: MessageBoxType.Warning,
				showCancelButton: true,
			}).confirmPromise;

			await api.draft.remove(this.value.id);
			this.$emit("removed");
		},
	},
};
</script>

<style module lang="less">
@import "../../css/imports";

.container {
	display: flex;
	align-items: center;
}

.main {
	flex: 1;
	margin: 0;
}

.target {
	padding: 5px;
	border-radius: 4px;
	color: white;
	background: dodgerblue;
}

.history {
	color: #c3c3c3;
	background-color: #3a3a3a;
	box-shadow: #0a0a0a 0 0 1px 1px inset;
}

.history-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.time {
	color: @color-text-minor;
	padding-right: 15px;

	& > i {
		margin-right: 5px;
	}
}
</style>
