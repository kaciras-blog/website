<template>
	<kx-frame title="查看回复">
		<div :class="$style.body">
			<discussion-content
				:value="value"
				tag="div"
				class="segment"
				:class="$style.item"
			/>

			<scroll-paging-view
				v-model="pageData"
				:start="value.replies.length"
				:loader="loadNext"
				:auto-load="true"
			>
				<template v-slot="{ items }">
					<ol class="clean-list">
						<discussion-content
							v-for="item of items"
							:key="item.id"
							:value="item"
							:class="$style.item"
						/>
					</ol>
				</template>
			</scroll-paging-view>
		</div>

		<div :class="$style.input_footer">
			<kx-button class="primary" @click="showEditorFrame">添加回复</kx-button>
		</div>
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
.body {
	overflow-y: auto;
	flex: 1;
}

.item {
	padding: 15px;
}

.input_footer {
	display: flex;
	align-items: flex-end;
	padding: 10px;
	background: #ebebeb;
}

.input {
	flex: 1;

	min-height: 0;
	max-height: 30px; // HACK
	font-size: 14px;
	padding: .5rem;
	margin-right: 10px;
	border: none;
	border-radius: 4px;

	// hide scroll bar, support Firefox, Safari, and Chrome
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	&:focus {
		max-height: 10rem;
	}
}
</style>
