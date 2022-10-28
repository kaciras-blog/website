<template>
	<KxSwitchBox
		:disabled='unsupported || loading'
		:modelValue='StaleApi'
		:class='$style.line'
		@update:modelValue='v => setOption("StaleApi", v)'
	>
		动态内容缓存
	</KxSwitchBox>

	<div v-if='unsupported' :class='$style.alert'>
		您的浏览器不支持 ServiceWorker，无法使用该功能
	</div>
	<div v-else-if='error' :class='$style.alert'>
		无法连接 ServiceWorker：{{ error }}
	</div>
	<div v-else-if='loading' :class='$style.alert'>
		正在连接 ServiceWorker……
	</div>
	<div v-else class='minor-text'>
		对动态内容使用 stale-while-revalidate 缓存策略，
		使访问过的页面无需网络立即加载，但新内容会被延迟到下一次请求。
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { KxSwitchBox } from "@kaciras-blog/uikit";
import { getSettings, putSetting } from "@/service-worker/client/settings";

const unsupported = import.meta.env.SSR || !("serviceWorker" in navigator);

export default defineComponent({
	name: "SettingPanel",
	components: {
		KxSwitchBox,
	},
	data: () => ({
		unsupported,
		loading: true,
		error: null,
		StaleApi: false,
	}),
	methods: {
		async setOption(key: string, value: any) {
			await putSetting(key, value);
			(this as any)[key] = value;
		},
	},
	async beforeMount() {
		if (unsupported) {
			return; // SW 不是本项目必须的，故 ServiceWorker 可能不存在
		}

		// 虽然说如果无法注册 SW 的话它永远不会 resolve，但该组件用得不多，应该不至于内存泄漏。
		await navigator.serviceWorker.ready;
		try {
			Object.assign(this.$data, await getSettings());
			this.loading = false;
		} catch (e) {
			this.error = e.message;
		}
	},
});
</script>

<style module lang="less">
.line {
	margin-bottom: 1rem;
}

.alert {
	color: red;
	text-align: center;
}
</style>
