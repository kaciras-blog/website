<template>
	<main>
		<discussion-config-panel></discussion-config-panel>
		<div class="panel compact">
			<div :class="$style.toolbar">
				<kx-check-box v-model="allChecked"/>
				<div class="btn-group">
					<kx-button class="primary" @click="approveAll">全部发布</kx-button>
					<kx-button class="dangerous" @click="removeAll">全部删除</kx-button>
				</div>
			</div>
			<ul class="list" :class="$style.list">
				<discussion-check-item v-for="item of pendingList" :key="item.id" :item="item"/>
			</ul>
		</div>
	</main>
</template>

<script>
import api from "../../api";
import DiscussionConfigPanel from "./DiscussionConfigPanel";
import { articleLink } from "../../blog-plugin";
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
				return this.pendingList.every(item => item.checked);
			},
			set(value) {
				this.pendingList.forEach(item => item.checked = value);
			},
		},
	},
	methods: {
		removeAll() {

		},
		approveAll() {

		},
	},
	async created() {
		const list = await api.discuss.getModeration();
		list.items.forEach(normalize);
		this.pendingList = list.items;
	},
};
</script>

<style module lang="less">
// TODO: 清除list的间距，是否写到list类里
.list {
	margin: 0;
}

.toolbar {
	display: flex;
	padding: 20px;
	justify-content: space-between;
	align-items: center;
}

</style>
