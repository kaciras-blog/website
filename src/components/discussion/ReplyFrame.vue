<template>
	<kx-frame>
		<kx-frame-header title="查看回复"/>

		<div :class="$style.frameBody">
			<scroll-paging-view
				v-model="pageData"
				:start="replies.length"
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
		</div>

		<button
			:class="$style.bottom"
			@click="showEditorFrame"
		>
			<EditIcon :class="$style.icon"/>写回复...
		</button>
	</kx-frame>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import { useDialog } from "@kaciras-blog/uikit";
import api, { Discussion, DiscussionState, Topic, User } from "@/api";
import EditorFrame from "./EditorFrame.vue";
import DiscussionContent from "./DiscussionContent.vue";

interface Discussion_Copy {
	type: number;
	objectId: number;
	id: number;
	parent?: Discussion;
	floor: number;
	nestId: number;
	nestFloor: number;
	nestSize: number;
	user: User;
	nickname?: string;
	content: string;
	time: number;
	state: DiscussionState;
	topic?: Topic;
	replies?: Discussion[];
}

const props = defineProps<Discussion_Copy>();

const $dialog = useDialog();

const pageData = ref({
	items: props.replies!.slice(),
	total: props.nestSize,
});

function loadNext(start: number, count: number) {
	return api.discuss.getReplies(props.id, start, count);
}

function showEditorFrame() {
	const context = {
		parent: props,
		objectId: props.objectId,
		type: props.type,
		afterSubmit,
	};
	$dialog.show(EditorFrame, context);
}

function afterSubmit(entity: Discussion) {
	pageData.value.items.push(entity);
}
</script>

<style module lang="less">
.list {
	composes: clean-list from global;
	padding: 0 15px;
}
.item {
	padding: 15px 0;
	border-bottom: solid 1px #eee;
}

.frameBody {
	flex: 1;
	overflow-y: auto;
}

.bottom {
	display: flex;
	align-items: center;
	color: #666;
	border-top: solid 1px #ddd;
}

.icon {
	margin: 10px;
	font-size: 18px;
}
</style>
