<template>
	<div>
		<template v-if="state === 1">
			页面正在加载，按ESC可以
			<a class="hd-link" @click="$emit('cancel')">取消</a>
		</template>
		<template v-else-if="state === 2">
			页面加载出错！
		</template>
		<template v-else>
			5秒都没加载完，可能是废了<br>
			您可以继续等等，或是 <a class="hd-link" @click="$emit('cancel')">取消</a>
		</template>
	</div>
</template>

<script>
export default {
	name: "NavigatePoptip",
	props: {
		state: {}, // 1-加载中 2-出错 3-超时
	},
};
</script>
