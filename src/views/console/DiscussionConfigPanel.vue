<template>
	<section class="panel" :class="$style.config_section">
		<h2>评论系统设置</h2>

		<div :class="$style.config_row">
			<kx-check-box
				v-for="(_, name) in config"
				:key="name"
				v-model="config[name]"
				:class="$style.checkbox"
				@input="value => sync(name, value)">
				{{LABELS[name]}}
			</kx-check-box>
		</div>

		<!-- TODO: 这个函数式组件 v-show 无效？ -->
		<sk-fading-circle v-if="refreshing" :class="$style.progress"/>
	</section>
</template>

<script>
import api from "@/api";

// 传过来的配置没有描述，这里直接定义
const LABELS = {
	enabled: "启用评论",
	allowAnonymous: "允许匿名评论",
	moderation: "需要审核",
};

export default {
	name: "DiscussionConfigPanel",
	data: () => ({
		LABELS,
		config: {
			enabled: true,
			allowAnonymous: true,
			review: false,
		},
		refreshing: false,
	}),
	methods: {
		async sync(name, value) {
			this.refreshing = true;
			await api.config.set("discussion", { [name]: value });
			this.refreshing = false;
		},
	},
	created() {
		api.config.get("discussion").then(props => this.config = props);
	},
};
</script>

<style module lang="less">
.config_section {
	position: relative;
	margin-bottom: 30px;
}

.config_row {
	display: flex;
}

.checkbox {
	margin-right: 30px;
}

.progress {
	position: absolute;
	top: 0;
	right: 1rem;
	width: 2rem;
	height: 2rem;
}
</style>
