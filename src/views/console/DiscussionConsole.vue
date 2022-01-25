<template>
	<div>
		<discussion-config-panel></discussion-config-panel>
		<div class="panel compact">
			<div :class="$style.toolbar">
				<kx-check-box v-model="allChecked"/>

				<div class="btn-group">
					<kx-button
						class="primary"
						:disabled="!selected.length"
						@click="approveAll"
					>
						全部发布
					</kx-button>
					<kx-button
						class="dangerous"
						:disabled="!selected.length"
						@click="removeAll"
					>
						全部删除
					</kx-button>
				</div>
			</div>
			<ul class="clean-list">
				<discussion-check-item v-for="item of pendingList" :key="item.id" :item="item"/>
			</ul>
		</div>
	</div>
</template>

<script>
import api, { DiscussionState } from "@/api";
import DiscussionConfigPanel from "./DiscussionConfigPanel.vue";
import DiscussionCheckItem from "./DiscussionCheckItem.vue";

export default {
	name: "DiscussionConsole",
	components: {
		DiscussionCheckItem,
		DiscussionConfigPanel,
	},
	data: () => ({
		pendingList: [],
	}),
	computed: {
		allChecked: {
			get() {
				const { length } = this.pendingList;
				return length > 0 && length === this.selected.length;
			},
			set(value) {
				this.pendingList.forEach(item => item.checked = value);
			},
		},
		selected() {
			return this.pendingList.filter(item => item.checked);
		},
		selectedIds() {
			return this.selected.map(item => item.id);
		},
	},
	methods: {
		async loadItems() {
			const list = await api.discuss.getList({
				count: 30,
				includeTopic: true,
				state: DiscussionState.Moderation,
			});
			list.items.forEach(v => v.checked = false);
			this.pendingList = list.items;
		},
		async removeAll() {
			await api.discuss.updateStates(this.selectedIds, DiscussionState.Deleted);
			return this.loadItems();
		},
		async approveAll() {
			await api.discuss.updateStates(this.selectedIds, DiscussionState.Visible);
			return this.loadItems();
		},
	},
	created() {
		this.loadItems();
	},
};
</script>

<style module lang="less">
.toolbar {
	display: flex;
	padding: 20px;
	justify-content: space-between;
	align-items: center;
}
</style>
