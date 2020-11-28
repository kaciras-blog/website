<template>
	<kx-frame>
		<kx-frame-header title="查看回复">
			<button
				class="nav-item"
				title="添加回复"
				@click="showEditorFrame"
			>
				<i :class="$style.addIcon"/>
			</button>
		</kx-frame-header>

		<scroll-paging-view
			v-model="pageData"
			class="kx-frame-body"
			:start="value.replies.length"
			:loader="loadNext"
			:auto-load="true"
		>
			<template v-slot="{ items }">
				<ol :class="$style.list">
					<discussion-content
						v-for="item of items"
						:key="item.id"
						:value="item"
						:class="$style.item"
					/>
				</ol>
			</template>
		</scroll-paging-view>
	</kx-frame>
</template>

<script>
import api from "@/api";
import DiscussionContent from "./DiscussionContent";
import EditorFrame from "@/components/discussion/EditorFrame";

export default {
	name: "ReplyFrame",
	components: {
		DiscussionContent,
	},
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data() {
		const pageData = {
			items: this.value.replies.slice(),
			total: this.value.replyCount,
		};
		return { pageData };
	},
	methods: {
		loadNext(start, count) {
			return api.discuss.getReplies(this.value.id, start, count);
		},
		showEditorFrame() {
			const context = {
				objectId: this.value.objectId,
				type: this.value.type,
				parent: this.value.id,
				afterSubmit: this.submitted,
			};
			this.$dialog.show(EditorFrame, context);
		},
		submitted(entity) {
			this.pageData.items.push(entity);
		},
	},
};
</script>

<style module lang="less">
.item {
	padding: 15px 0;
	border-bottom: solid 1px #eee;
}

.list {
	composes: clean-list from global;
	padding: 0 15px;
}

.addIcon {
	composes: fas fa-plus from global;
	font-size: 20px;
	vertical-align: middle;
}
</style>
