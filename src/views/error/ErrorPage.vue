<template>
	<BasePageLayout>
		<PageMeta title='错误' :body-class='$style.container'/>

		<ErrorContent
			v-if='code === 400'
			title='400 Bad Request'
			image='@/assets/img/error-other.png'
		>
			<p>如果正常操作跳到本页，快叫作者起床<span class='red'>改BUG!!!</span></p>
			<p>如果是自己输入的地址，请看看有没有写错。</p>
		</ErrorContent>

		<ErrorContent
			v-else-if='code === 403'
			title='403 Access Denied'
			image='@/assets/img/error-403.jpg'
		>
			<p>你要前往的页面<span class='red'>可不简单</span>！！！</p>
			<p>只有<span class='red'>被选中的人</span>才能浏览！！！</p>
			<p>和我一起努力吧，骚年。</p>
		</ErrorContent>

		<ErrorContent
			v-else-if='code === 404 || code === 410'
			title='404 Not Found'
			image='@/assets/img/error-404.jpg'
		>
			<p>你所寻找的 Loli <span class='red'>不存在</span>！！</p>
			<p>可能该 Loli 已被<span class='red'>推倒</span>！！</p>
			<p>或者是被怪蜀黍<span class='red'>诱拐</span>！！</p>
			<p>亦或是被 Loli 控<span class='red'>吃掉</span>！！</p>
		</ErrorContent>

		<ErrorContent
			v-else-if='code === 429'
			title='429 Too Many Requests'
			image='@/assets/img/error-429.jpg'
		>
			<p>服务器忙不过来啦！</p>
			<p>可能是您的请求过于频繁，请歇会再试。</p>
			<p>也有可能是服务器出现了 BUG。</p>
		</ErrorContent>

		<ErrorContent
			v-else-if='code === 500 || code === 503'
			:title='code + " Internal Server Error"'
			image='@/assets/img/error-500.png'
		>
			<p>服务器要<span class='red'>爆炸啦！！</span></p>
			<p>快叫博主起床改 BUG 啊。</p>
		</ErrorContent>

		<ErrorContent
			v-else
			:title='value + " 其它错误"'
			image='@/assets/img/error-other.png'
		>
			<p>你发现了一个隐藏的错误</p>
			<p>就连作者都没有为这个错误编写页面</p>
		</ErrorContent>
	</BasePageLayout>
</template>

<script setup lang="ts">
import { computed, useSSRContext } from "vue";
import BasePageLayout from "@/components/BasePageLayout.vue";
import ErrorContent from "./ErrorContent.vue";
import PageMeta from "@/components/PageMeta";

interface ErrorPageProps {

	/**
	 * 错误码的字符串，比如 "404", "429"。
	 * vue-router 不支持 props 类型转换。
	 */
	value: string;
}

const props = defineProps<ErrorPageProps>();

const code = computed(() => {
	return parseInt(props.value);
});

if (import.meta.env.SSR) {
	useSSRContext()!.status = code.value;
}
</script>

<style module lang="less">
.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
