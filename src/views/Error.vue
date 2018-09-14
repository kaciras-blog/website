<template>
	<error-content v-if="code === '400'"
				   title="400 Bad Request"
				   image="../assets/error-other.png">
		<p>如果正常操作跳到本页，快叫作者起床<span class="red">改BUG!!!</span></p>
		<p>如果您是自己输入的地址栏信息，看看有没有写错</p>
		<p>如果要尝试攻击本网站，还请换种参数或姿势</p>
	</error-content>

	<error-content v-else-if="code === '404'"
				   title="404 Not Found"
				   image="../assets/baotou.jpg">
		<p>你所寻找的Loli<span class="red">不存在</span>！！</p>
		<p>可能该Loli已被<span class="red">推倒</span>！！</p>
		<p>或者是被怪蜀黍<span class="red">诱拐</span>！！</p>
		<p>亦或是被Loli控<span class="red">吃掉</span>！！</p>
	</error-content>

	<error-content v-else-if="code === '500'"
				   title="500 Internal Server Error"
				   image="../assets/Home-Server-icon.png">
		<p>服务器要<span class="red">爆炸啦！！</span>，快叫博主起床改BUG啊</p>
	</error-content>

	<error-content v-else
				   title="其他错误"
				   image="../assets/error-other.png">
		<p>您发现了一个被埋没的错误</p>
		<p>就连作者都没有为这个错误编写页面</p>
	</error-content>
</template>

<script>
import ErrorContent from "../components/ErrorContent";

export default {
	name: "Error",
	components: { ErrorContent },
	props: ["code"],
	created() {
		this.$emit("layoutChanged", { banner: false }, true);
	},
};
</script>
