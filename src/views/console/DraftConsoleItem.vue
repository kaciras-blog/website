<template>
	<div>
		<div class="draft">
			<h3 class="title">{{value.title}}</h3>
			<span class="minor-text">
				<i class="fas fa-pencil-alt"></i>
				<time>{{value.time}}</time>
			</span>

			<div class="btn-group">
				<kx-button class="primary outline" :route="'/edit/' + value.id">编辑</kx-button>
				<kx-button class="dangerous outline" @click="deleteDraft(value.id)">删除</kx-button>
			</div>
		</div>

		<div class="history" v-if="showHistory===draft">
			<div class="history-item" v-for="his in value.histories" :key="his.saveCount">
				<div>
					<span><i class="fa fa-save"></i>保存于：{{his.time}}</span>
					<span><i class="fa fa-pencil"></i>字数：{{his.contentSize}}</span>
				</div>
				<kx-button class="primary">编辑</kx-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "DraftConsoleItem",
	props: {
		value: {
			type: Object,
			required: true,
		},
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

time {
	margin: 0  1em 0 .5em;
}
</style>
