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
			<li v-for="item of friends" class="segment">
				<span :class="$style.friendLabel">
					友链
				</span>
				检测到网站
				<a
					:href="item.url"
					class="highlight"
					target="_blank"
				>
					{{ item.name }}
				</a>

				<template v-if="item.type === 'Moved'">
					重定向到
					<a
						:href="item.newUrl"
						class="highlight"
						target="_blank"
					>
						{{ item.newUrl }}
					</a>
				</template>
				<template v-else-if="item.type === 'AbandonedMe'">
					的友链页不存在本站的链接，可能删除了本站，或是使用了异步渲染。
				</template>
				<template v-else-if="item.type === 'Inaccessible'">
					无法访问
				</template>

				<time :class="$style.time">{{ item.time | localDateMinute }}</time>
			</li>

			<li v-for="item of discussions" class="segment">
				<header>
					<span :class="$style.diasussionLabel">
						评论
					</span>

					<a
						:href="item.url"
						class="highlight"
						target="_blank"
					>
						{{ item.title }}
					</a>

					<template v-if="item.parentFloor">
						的 {{ item.parentFloor }} 楼
					</template>

					有新的评论 #{{ item.floor }}

					<time :class="$style.time">
						{{ item.time | localDateMinute }}
					</time>
				</header>

				<blockquote :class="$style.content">{{ item.preview }}</blockquote>
			</li>
		</ul>
	</div>
</template>

<script>
import AtomSpinner from "epic-spinners/src/components/lib/AtomSpinner.vue";
import api from "@/api";
import { errorMessage } from "@/utils";

export default {
	name: "NotificationConsole",
	components: {
		AtomSpinner,
	},
	data: () => ({
		loading: true,
		friends: [],
		discussions: [],
	}),
	methods: {
		async clear() {
			await api.notification.clear();
			return this.refresh();
		},
		async refresh() {
			try {
				Object.assign(this.$data, await api.notification.getAll());
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
	padding: 4px 10px;
	border-radius: 4px;
}

.friendLabel {
	composes: label;
	color: white;
	background: #0776df;
}

.diasussionLabel {
	composes: label;
	color: white;
	background: #01c625;
}

.time {
	float: right;
}

.content {
	composes: minor-text from global;

	margin-left: 0;
	padding: 4px 0 4px 10px;
	border-left: solid 4px #ccc;
}
</style>
