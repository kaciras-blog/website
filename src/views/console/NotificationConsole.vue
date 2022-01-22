<template>
	<div>
		<div class="btn-group console-toolbar">
			<kx-task-button
				class="primary"
				:on-click="clear"
			>
				清除全部
			</kx-task-button>
		</div>

		<div
			v-if="loading"
			:class="$style.spinner"
		>
			<atom-spinner
				:animation-duration="1200"
				:size="64"
				color="#33aaff"
			/>
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
	</div>
</template>

<script>
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";
import api from "@/api";
import { errorMessage } from "@/utils";
import FriendNotice from "@/views/console/FriendNotice";
import DiscussionNotice from "@/views/console/DiscussionNotice";
import { localDateMinute } from "@/blog-plugin";

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
}

export default {
	name: "NotificationConsole",
	components: {
		AtomSpinner,
	},
	data: () => ({
		MAP,
		loading: true,
		notifications: [],
	}),
	methods: {
		localDateMinute,

		async clear() {
			await api.notification.clear();
			return this.refresh();
		},
		async refresh() {
			try {
				this.notifications = await api.notification.getAll();
				this.loading = false;
			} catch (e) {
				this.$dialog.alertError("加载失败", errorMessage(e));
			}
		},
	},
	created() {
		this.refresh();
	},
};
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
