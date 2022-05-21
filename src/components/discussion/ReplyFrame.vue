<template>
	<KxFrame title="查看回复">
		<div :class="$style.frameBody">
			<ScrollPagingView
				v-model="data"
				:loader="loadNext"
				:auto-load="true"
			>
				<template v-slot="{ items }">
					<ol :class="$style.list">
						<DiscussionContent
							v-for="item of items"
							:key="item.id"
							:nest-root="host"
							:value="item"
							:class="$style.item"
						/>
					</ol>
				</template>
			</ScrollPagingView>
		</div>

		<button
			:class="$style.bottom"
			@click="showEditorFrame"
		>
			<EditIcon :class="$style.icon"/>
			写回复...
		</button>
	</KxFrame>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { KxFrame, ScrollPagingView, useDialog } from "@kaciras-blog/uikit";
import EditIcon from "bootstrap-icons/icons/pencil-square.svg?sfc";
import api, { Discussion, ListQueryView } from "@/api";
import EditorFrame from "./EditorFrame.vue";
import DiscussionContent from "./DiscussionContent.vue";

interface ReplyFrameProps {
	host: Discussion;
	modelValue: ListQueryView<Discussion>;
}

const props = defineProps<ReplyFrameProps>();
const emit = defineEmits(["update:modelValue"]);

const $dialog = useDialog();

const data = ref(props.modelValue);

watch(data, v => emit("update:modelValue", v));

function showEditorFrame() {
	const parent = props.host;
	const { objectId, type } = parent;
	const context = {
		type,
		objectId,
		parent,
		onAfterSubmit: afterSubmit,
	};
	$dialog.show(EditorFrame, context);
}

function afterSubmit(entity: Discussion) {
	data.value.total++;
	data.value.items.push(entity);
}

function loadNext(start: number, count: number) {
	return api.discuss.getReplies(props.host.id, start, count);
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
