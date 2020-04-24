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
						@click="approveAll">
						全部发布
					</kx-button>
					<kx-button
						class="dangerous"
						:disabled="!selected.length"
						@click="removeAll">
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
import { articleLink } from "@/blog-plugin";
import DiscussionConfigPanel from "./DiscussionConfigPanel";
import DiscussionCheckItem from "./DiscussionCheckItem";

function normalize(item) {
	item.checked = false;

	if (typeof item.target === "string") {
		item.title = item.target;
		item.link = "/about";
	} else {
		item.title = item.target.title;
		item.link = articleLink(item.target);
	}
	delete item.target;
}

export default {
	name: "DiscussionConsole",
	components: { DiscussionCheckItem, DiscussionConfigPanel },
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
			const list = await api.discuss.getModeration();
			list.items.forEach(normalize);
			this.pendingList = list.items;
		},
		async removeAll() {
			await api.discuss.updateStates(this.selectedIds, DiscussionState.Deleted);
			this.loadItems();
		},
		async approveAll() {
			await api.discuss.updateStates(this.selectedIds, DiscussionState.Visible);
			this.loadItems();
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
