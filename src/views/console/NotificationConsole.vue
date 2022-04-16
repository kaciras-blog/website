<template>
	<div class="btn-group console-toolbar">
		<KxTaskButton
			class="primary"
			:on-click="clear"
		>
			<ClearIcon class="prefix"/>
			清除全部
		</KxTaskButton>
	</div>

	<div
		v-if="loading"
		:class="$style.spinner"
	>
		<AtomSpinner/>
		<span>加载中……</span>
	</div>

	<ul v-else :class="$style.list">
		<li v-for="{type, data, time} of notifications" class="segment">
			<p>
				<span :class="[$style.label, $style[MAP[type].name]]">
					{{ MAP[type].displayName }}
				</span>
				<time :class="$style.time">{{ localDateMinute(time) }}</time>
			</p>

			<component :is="MAP[type].component" v-bind="data"/>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useDialog, KxTaskButton, AtomSpinner } from "@kaciras-blog/uikit";
import ClearIcon from "@material-design-icons/svg/filled/clear_all.svg?sfc";
import api, { Notice } from "@/api";
import { localDateMinute } from "@/common";
import { errorMessage } from "@/utils";
import FriendNotice from "@/views/console/FriendNotice.vue";
import DiscussionNotice from "@/views/console/DiscussionNotice.vue";

const MAP = {
	1: {
		displayName: "友链",
		name: "Friend",
		component: FriendNotice,
	},
	2: {
		displayName: "新评论",
		name: "Discussion",
		component: DiscussionNotice,
	},
};

const dialog = useDialog();

const loading = shallowRef(true);
const notifications = shallowRef<Array<Notice<unknown>>>([]);

async function clear() {
	await api.notification.clear();
	return refresh();
}

async function refresh() {
	try {
		notifications.value = await api.notification.getAll();
		loading.value = false;
	} catch (e) {
		dialog.alertError("加载失败", errorMessage(e));
	}
}

refresh();
</script>

<style module lang="less">
.spinner {
	display: flex;
	flex-direction: column;
	align-items: center;

	// 虽然浏览器支持还不好，但是后台自己先用用也行
	gap: 10px;

	font-size: 1.125rem;
}

.list {
	composes: clean-list from global;
	font-size: initial;
}

.label {
	display: inline-block;
	margin-right: 8px;
	padding: 2px 8px;
	font-size: .875em;
	border-radius: 4px;
}

.Friend {
	color: white;
	background: #0776df;
}

.Discussion {
	color: white;
	background: #01c625;
}

.time {
	float: right;
}
</style>
