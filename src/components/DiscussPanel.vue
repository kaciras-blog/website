<template>
	<section id="discuss" class="panel">

		<header class="flex between center-align segment" style="font-size: initial">
			<h2>评论区</h2>
			<h3>{{totalCount}}条</h3>
		</header>

		<!-- 回复输入框 -->
		<discuz-editor @discussion-added="showLast" />

		<!-- 评论列表 -->
		<discussion v-for="item of discussions"
					:key="item.id"
					:value="item"
					@item-removed="loadPageBackground(pageIndex)"
		/>

		<!-- 分页按钮 -->
		<pager-buttons v-if="totalCount > pageSize"
					   :index="pageIndex"
					   :page-size="pageSize"
					   :total-count="totalCount"
					   @loadPage="loadPage"/>
	</section>
</template>

<script>
	import api from "../../apis/Api.js";
	import discuzEditor from "./DiscuzEditor.vue";
	import discussion from "./Discussion.vue";
	import pagerButtons from "../../component/PagerButtons.vue";

	export default {
		name: "discuss-panel",
		data() {
			return {
				discussions: [],
				pageIndex: 0,
				totalCount: 0,
				pageSize: 20,
			}
		},
		methods: {
			loadPageBackground(index) {
				return api.discussion.getList(getUrlPathPart(2), index * this.pageSize, this.pageSize).then(data =>{
					this.discussions = data.list;
					this.pageIndex = index;
					this.totalCount = data.total;
				});
			},
			loadPage(index) {
				this.loadPageBackground(index).then(() => scrollToElementStart($("#discuss")));
			},
			showLast() {
				this.loadPageBackground(Math.floor(this.totalCount / this.pageSize)).then(() => scrollToElementEnd($("#discuss")));
			},
		},
		components: {
			discuzEditor,
			discussion,
			pagerButtons,
		},
		created() {
			this.loadPageBackground(0);
		},
	}
</script>
