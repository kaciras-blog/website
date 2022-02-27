<template>
	<div>
		<discussion-config-panel/>

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
				<discussion-check-item
					v-for="item of pendingList"
					v-bind="item"
					:key="item.id"
				/>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { KxButton, KxCheckBox } from "@kaciras-blog/uikit";
import api, { DiscussionState } from "@/api";
import DiscussionConfigPanel from "./DiscussionConfigPanel.vue";
import DiscussionCheckItem from "./DiscussionCheckItem.vue";

const pendingList = ref([]);

const selected = computed(() => pendingList.value.filter(item => item.checked));

const selectedIds = computed(() => selected.value.filter(item => item.id));

const allChecked = computed({
	get() {
		const { length } = pendingList.value;
		return length > 0 && length === selected.value.length;
	},
	set(value) {
		pendingList.value.forEach(item => item.checked = value);
	},
});

async function loadItems() {
	const { items } = await api.discuss.getList({
		count: 30,
		includeTopic: true,
		state: DiscussionState.Moderation,
	});
	items.forEach(v => v.checked = false);
	pendingList.value = items;
}

loadItems();

async function removeAll() {
	await api.discuss.updateStates(selectedIds.value, DiscussionState.Deleted);
	return loadItems();
}

async function approveAll() {
	await api.discuss.updateStates(selectedIds.value, DiscussionState.Visible);
	return loadItems();
}
</script>

<style module lang="less">
.toolbar {
	display: flex;
	padding: 20px;
	justify-content: space-between;
	align-items: center;
}
</style>
