<template>
	<section class="panel" :class="$style.config_section">
		<h2>设置</h2>

		<div :class="$style.config_row">
			<KxCheckBox
				v-for="(_, name) of config"
				:key="name"
				v-model="config[name]"
				:class="$style.checkbox"
			>
				{{ LABELS[name] }}
			</KxCheckBox>
		</div>

		<SkFadingCircle v-show="refreshing" :class="$style.progress"/>
	</section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { KxCheckBox, SkFadingCircle } from "@kaciras-blog/uikit";
import api from "@/api";

// 传过来的配置没有描述，这里直接定义.
const LABELS = {
	disabled: "禁止发表评论",
	loginRequired: "禁止匿名评论",
	moderation: "需要审核",
};

// 虽然会被替换，但还是给个值够避免布局移动。
const config = reactive({
	disabled: false,
	loginRequired: false,
	moderation: false,
});

const refreshing = ref(false);

watch(config, async changed => {
	refreshing.value = true;
	await api.config.set("discussion", changed);
	refreshing.value = false;
});

api.config.get("discussion").then(v => Object.assign(config, v));
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
	top: 1rem;
	right: 1rem;
	width: 2rem;
	height: 2rem;
}
</style>
