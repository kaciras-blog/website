<template>
	<DiscussionConfigPanel></DiscussionConfigPanel>

	<div class="panel">
		<div :class="$style.toolbar">
			<KxCheckBox v-model="allChecked"/>

			<div class="btn-group">
				<KxButton
					class="primary"
					:disabled="!selected.size"
					@click="approveAll"
				>
					全部发布
				</KxButton>
				<KxButton
					class="dangerous"
					:disabled="!selected.size"
					@click="removeAll"
				>
					全部删除
				</KxButton>
			</div>
		</div>

		<ul v-if="pendingList.length" class="clean-list">
			<DiscussionCheckItem
				v-for="item of pendingList"
				v-bind="item"
				:key="item.id"
				:checked="selected.has(item.id)"
				@update:checked="v => switchChecked(item, v)"
			/>
		</ul>
		<div v-else :class="$style.empty">没有需要审核的评论。</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { KxButton, KxCheckBox } from "@kaciras-blog/uikit";
import api, { DiscussionState, Discussion } from "@/api";
import DiscussionConfigPanel from "./DiscussionConfigPanel.vue";
import DiscussionCheckItem from "./DiscussionCheckItem.vue";

const pendingList = ref<Discussion[]>([]);
const selected = reactive(new Set<number>());

const allChecked = computed({
	get() {
		const { length } = pendingList.value;
		return length > 0 && length === selected.size;
	},
	set(value) {
		if (value) {
			pendingList.value.forEach(v => selected.add(v.id));
		} else {
			selected.clear();
		}
	},
});

function switchChecked(item: Discussion, value: boolean) {
	value ? selected.add(item.id) : selected.delete(item.id)
}

async function loadItems() {
	const data = await api.discuss.getList({
		count: 30,
		includeTopic: true,
		state: DiscussionState.Moderation,
	});
	selected.clear();
	pendingList.value = data.items;
}

loadItems();

function removeAll() {
	return api.discuss.updateStates(selected, DiscussionState.Deleted).then(loadItems);
}

function approveAll() {
	return api.discuss.updateStates(selected, DiscussionState.Visible).then(loadItems);
}
</script>

<style module lang="less">
.toolbar {
	display: flex;
	margin-bottom: 20px;
	justify-content: space-between;
	align-items: center;
}

.empty {
	composes: minor-text from global;
	text-align: center;
}
</style>
