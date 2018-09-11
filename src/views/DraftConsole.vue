<template>
	<div>
		<div class="buttons">
			<button class="dangerous" @click="deleteAll"><i class="far fa-trash-alt"></i>全部删除</button>
		</div>

		<div class="panel">
			<div class="segment" :key="draft.id" v-for="draft in drafts">

				<div class="draft">
					<div class="title">{{draft.title}}</div>
					<span class="minor-text"><i class="fas fa-pencil-alt"></i>{{draft.time}}</span>
					<router-link class="button" :to="'/edit/' + draft.id">编辑</router-link>
					<button class="dangerous" @click="deleteDraft(draft.id)">删除</button>
				</div>

				<div class="history" v-if="showHistory===draft">
					<div class="history-item" v-for="his in draft.histories" :key="his.saveCount">
						<div>
							<span><i class="fa fa-save"></i>保存于：{{his.time}}</span>
							<span><i class="fa fa-pencil"></i>字数：{{his.contentSize}}</span>
						</div>
						<button class="primary">编辑</button>
					</div>
				</div>
			</div>

			<span class="flex center-content minor-text" v-if="!loading && drafts.length===0">空空如也</span>

			<sk-fading-circle v-if="loading"></sk-fading-circle>
		</div>
	</div>
</template>

<script>
import api from "../apis";
import {deleteOn} from "../utils";

async function loadDrafts() {
	if (this.allLoaded) {
		return;
	}
	this.loading = true;

	try {
		const list = await api.draft.getList(0, 0, 20);
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
}

export default {
	name: "draft",
	methods: {
		deleteAll() {
			api.draft.clear().then(() => {
				this.drafts.splice(0, this.drafts.length);
				this.last = 0;
			})
				.catch(() => alert("清空失败!"));
		},
		deleteDraft(id) {
			api.draft.deleteOne(id).then(() => deleteOn(this.drafts, d => d["id"] === id));
		},
	},
	data() {
		return {
			drafts: [],
			showHistory: null,
			allLoaded: false,
			loading: true,
			last: 0,
		};
	},
	created: loadDrafts,
};
</script>

<style scoped>
.draft {
	display: flex;
}
.title {
	flex: 1;
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

.buttons {
	margin-bottom: 1rem;
}
</style>
