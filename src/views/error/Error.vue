<template>
	<base-page-layout :class="$style.container">
		<div :class="$style.body">
			<error-content v-if="code === '400'"
						   title="400 Bad Request"
						   :image="require('@/assets/img/error-other.png')">
				<p>如果正常操作跳到本页，快叫作者起床<span class="red">改BUG!!!</span></p>
				<p>如果您是自己输入的地址栏信息，看看有没有写错</p>
			</error-content>

			<error-content v-else-if="code === '404' || code === '410'"
						   title="404 Not Found"
						   :image="require('@/assets/img/error-404.jpg')">
				<p>你所寻找的 Loli <span class="red">不存在</span>！！</p>
				<p>可能该 Loli 已被<span class="red">推倒</span>！！</p>
				<p>或者是被怪蜀黍<span class="red">诱拐</span>！！</p>
				<p>亦或是被 Loli 控<span class="red">吃掉</span>！！</p>
			</error-content>

			<error-content v-else-if="code === '500'"
						   title="500 Internal Server Error"
						   :image="require('@/assets/img/error-500.png')">
				<p>服务器要<span :class="$style.red">爆炸啦！！</span>，快叫博主起床改BUG啊</p>
			</error-content>

			<error-content v-else title="其他错误"
						   :image="require('@/assets/img/error-other.png')">
				<p>你发现了一个隐藏的错误</p>
				<p>就连作者都没有为这个错误编写页面</p>
			</error-content>
		</div>
	</base-page-layout>
</template>

<script>
import ErrorContent from "./ErrorContent";

export default {
	name: "Error",
	components: { ErrorContent },
	props: ["code"],
};
</script>

<style module lang="less">
.red {
	color: #f40000;
}

.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 100vh;
}

.body {
	flex: 1;

	margin-top: 2rem;
	@media screen and (min-width: 768px) {
		margin-top: 5rem;
	}
}
</style>
