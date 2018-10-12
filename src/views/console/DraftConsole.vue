<template>
	<main>
		<div class="toolbar btn-group">
			<kx-button
				class="dangerous"
				icon="far fa-trash-alt"
				@click="deleteAll">
				全部删除
			</kx-button>
		</div>

		<div class="panel">
			<draft-console-item
				v-for="draft in drafts"
				:key="draft.id"
				class="segment"
				:value="draft"
				@removed="removeItem(draft.id)"/>

			<span v-if="!loading && drafts.length===0" class="minor-text">空空如也</span>

			<sk-fading-circle v-if="loading"/>
		</div>
	</main>
</template>

<script>
import api from "../../api";
import DraftConsoleItem from "./DraftConsoleItem";
import { deleteOn } from "../../utils";

export default {
	name: "DraftConsole",
	components: { DraftConsoleItem },
	methods: {
		deleteAll() {
			api.draft.clear().then(() => {
				this.drafts.splice(0, this.drafts.length);
				this.last = 0;
			}).catch(() => alert("清空失败!"));
		},
		async loadDrafts() {
			if (this.allLoaded) {
				return;
			}
			this.loading = true;

			try {
				const list = await api.draft.getList(1, 0, 20);
				if (list.length === 0) {
					this.allLoaded = true;
				} else {
					list.forEach(v => this.drafts.push(v));
					this.last = list[list.length - 1]["id"];
				}
			} catch (e) {
				alert("加载草稿失败!");
			}
			this.loading = false;
		},
		removeItem(id) {
			deleteOn(this.drafts, d => d.id === id);
		},
	},
	data:() =>({
		drafts: [],
		showHistory: null,
		allLoaded: false,
		loading: true,
		last: 0,
	}),
	created() {
		this.loadDrafts();
	},
};
</script>

<style scoped>
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

.toolbar {
	margin-bottom: 1rem;
}

time {
	margin: 0  1em 0 .5em;
}
</style>
