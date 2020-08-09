<template>
	<div>
		<div class="btn-group console-toolbar">
			<kx-button class="primary" @click="clear">清除全部</kx-button>
		</div>

		<ul :class="$style.list">
			<li v-for="item of friends" class="segment">
				<span :class="$style.friendLabel">
					友链
				</span>

				检测到友链网站：
				<a
					:href="item.url"
					class="highlight"
					target="_blank"
				>
					{{ item.name }}
				</a>

				<template v-if="item.type === 'AbandonedMe'">删除了我的友链</template>
				<template v-else>无法访问</template>

				<time :class="$style.time">
					{{ item.time | localDateMinute }}
				</time>
			</li>
		</ul>

		<ul :class="$style.list">
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
import api from "@/api";

export default {
	name: "NotificationConsole",
	data: () => ({
		friends: [],
		discussions: [],
	}),
	methods: {
		async clear() {
			await api.notification.clear();
			return this.refresh();
		},
		async refresh() {
			Object.assign(this.$data, await api.notification.getAll());
		},
	},
	created() {
		this.refresh();
	},
};
</script>

<style module lang="less">
.list {
	composes: clean-list from global;
	font-size: initial;
}

.label {
	display: inline-block;
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
