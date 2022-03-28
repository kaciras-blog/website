<template>
	<li :class="$style.container">
		<div :class="$style.main">
			<h3>{{ title }}</h3>

			<span :class="$style.time" title="创建时间">
				<EditIcon/>
				<time>{{ localDateMinute(createTime) }}</time>
			</span>
			<span :class="$style.time" title="最后更新">
				<UpdateIcon/>
				<time>{{ localDateMinute(updateTime) }}</time>
			</span>

			<span
				v-if="articleId"
				title="修改现有的文章"
				:class="$style.target"
			>
				<PaperPlaneIcon/>
				{{ articleId }}
			</span>
		</div>

		<div class="btn-group">
			<kx-button
				:route="'/edit/' + id"
				type="outline"
				color="primary"
			>
				编辑
			</kx-button>
			<kx-button
				type="outline"
				color="dangerous"
				@click="deleteDraft"
			>
				删除
			</kx-button>
		</div>
	</li>
</template>

<script setup lang="ts">
import { KxButton, MessageType, useDialog } from "@kaciras-blog/uikit";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import PaperPlaneIcon from "@/assets/icon/paper-plane.svg?sfc";
import UpdateIcon from "@material-design-icons/svg/filled/update.svg?sfc";
import api from "@/api";
import { localDateMinute } from "@/blog-plugin";

interface Draft_COPY {
	id: number;
	articleId?: number;
	userId: number;
	title: string;
	lastSaveCount: number;
	createTime: number;
	updateTime: number;
}

const props = defineProps<Draft_COPY>();
const emit = defineEmits(["removed"]);

const dialog = useDialog();

async function deleteDraft() {
	const prompt = await dialog.alert({
		title: "删除草稿",
		content: "删除后不可恢复，是否确定？",
		type: MessageType.Warning,
		cancelable: true,
	});
	if (prompt.isConfirm) {
		api.draft.remove(props.id).then(() => emit("removed"));
	}
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

	& > svg {
		font-size: 18px;
		vertical-align: -4px;
		margin-right: 5px;
	}
}
</style>
