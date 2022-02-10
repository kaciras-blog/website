<template>
	<div>
		检测到网站
		<a :href="url" class="highlight" target="_blank">{{ name }}</a>

		<template v-if="type === 0">
			重定向到
			<a :href="newUrl" class="highlight" target="_blank">
				{{ newUrl }}
			</a>
		</template>

		<template v-else-if="type === 1">无法访问</template>

		<template v-else-if="type === 2">
			的友链页不存在本站的链接，可能删除了本站，或是使用了异步渲染。
		</template>
	</div>
</template>

<script setup lang="ts">
import { FriendAccidentType } from "@/api";

interface FriendAccident_Copy {
	type: FriendAccidentType;
	name: string;
	url: string;
	newUrl?: string;
}

defineProps<FriendAccident_Copy>();
</script>
