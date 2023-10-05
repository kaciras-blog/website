<template>
	<span
		:class='[
			$style[AuthType[type]],
			$style.authTag,
		]'
		title='登录类型'
	>
		{{ AuthType[type] }}
	</span>
</template>

<script setup lang="ts">
import { AuthType } from "@/api/index.ts";

interface AuthTapeTagProps {
	type: AuthType;
}

defineProps<AuthTapeTagProps>();
</script>

<style module lang="less">
.authTag {
	padding: 1px 4px;
	border-radius: 4px;
	color: white;

	&::selection {
		background: none;
	}
}

.Local {
	background-color: #ef8660;
}

.Github {
	background-color: #63b1e2;
}

.Google {
	background-color: #85dead;
}
</style>
