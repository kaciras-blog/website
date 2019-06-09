<template>
	<li>
		<div :class="$style.draft">
			<h3 :class="$style.title">{{value.title}}</h3>

			<span class="minor-text">
				<i class="fas fa-pencil-alt"></i>
				<time :class="$style.time">{{value.updateTime}}</time>
			</span>

			<div class="btn-group">
				<kx-button
					class="primary outline"
					:route="'/edit/' + value.id">
					编辑
				</kx-button>
				<kx-button
					class="dangerous outline"
					@click="deleteDraft">
					删除
				</kx-button>
			</div>
		</div>

		<!--<div class="history">-->
		<!--<div class="history-item" v-for="his in value.histories" :key="his.saveCount">-->
		<!--<div>-->
		<!--<span><i class="fa fa-save"></i>保存于：{{his.time}}</span>-->
		<!--<span><i class="fa fa-pencil"></i>字数：{{his.contentSize}}</span>-->
		<!--</div>-->
		<!--<kx-button class="primary">编辑</kx-button>-->
		<!--</div>-->
		<!--</div>-->
	</li>
</template>

<script>
import api from "../../api";
import { MessageBoxType } from "kx-ui/src/dialog";

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
			this.$dialog.messageBox({
				title: "删除草稿",
				content: "删除后不可恢复，是否确定？",
				type: MessageBoxType.Warning,
				cancelable: true,
			})
				.confirmThen(() => api.draft.remove(this.value.id))
				.then(() => this.$emit("removed"));
		},
	},
};
</script>

<style module lang="less">
.draft {
	display: flex;
	align-items: center;
}

.title {
	flex: 1;
	margin: 0;
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
	margin: 0 1em 0 .5em;
}
</style>
