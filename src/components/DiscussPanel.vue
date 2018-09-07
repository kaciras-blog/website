<template>
	<section id="discuss" class="panel">

		<header class="segment">
			<h2 class="compact">评论区</h2>
			<span id="discuss-num">{{totalCount}}条</span>
		</header>

		<discuz-editor @discussion-added="showLast"></discuz-editor>

		<discussion
			v-for="item of discussions"
			:key="item.id"
			:value="item"
			:replying="replying"
			@reply="reply"
			@item-removed="loadPageBackground(pageIndex)">
		</discussion>

		<pager-buttons
			v-if="totalCount > pageSize"
			:index="pageIndex"
			:page-size="pageSize"
			:total-count="totalCount"
			@loadPage="loadPage">
		</pager-buttons>
	</section>
</template>

<script>
import api from "../apis";
import discuzEditor from "./DiscuzEditor.vue";
import discussion from "./Discussion.vue";
import {scrollToElementEnd, scrollToElementStart} from "../utils";

export default {
	name: "discuss-panel",
	data() {
		return {
			discussions: [],
			pageIndex: 0,
			totalCount: 0,
			pageSize: 20,

			replying: 0,
		};
	},
	components: {
		discuzEditor,
		discussion,
	},
	methods: {
		loadPageBackground(index) {
			api.discuss.getList(this.$route.params.id, index * this.pageSize, this.pageSize).then(data => {
				this.discussions = data.list;
				this.pageIndex = index;
				this.totalCount = data.total;
			});
		},
		loadPage(index) {
			this.loadPageBackground(index).then(() => scrollToElementStart("discuss"));
		},
		showLast() {
			this.loadPageBackground(Math.floor(this.totalCount / this.pageSize)).then(() => scrollToElementEnd("discuss"));
		},
		reply(id) {
			this.replying = id;
		},
	},
	// 评论经常变动，不进行预渲染，首屏显示菊花图
	beforeMount() {
		this.loadPageBackground(0);
	},
};
</script>

<style lang="less">
.discuss > header {
	font-size: initial;
	& > h2 {
		display: inline-block;
	}
}

.round {
	border-radius: .4rem;
}

#discuss-num {
	float: right;
}
</style>
