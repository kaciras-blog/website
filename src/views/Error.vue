<template>
<main id="error-container">
	<div class="err-main panel" v-if="status === '400'">
		<img src="../assets/error-other.png">
		<h2>400 Bad Request</h2>
		<span></span>
		<div>
			<p>如果正常操作跳到本页，快叫作者起床<span class="red">改BUG!!!</span></p>
			<p>如果您是自己输入的地址栏信息，看看有没有写错</p>
			<p>如果要尝试攻击本网站，还请换种参数或姿势</p>
		</div>
	</div>
	<div class="err-main panel" v-else-if="status === '404'">
		<img src="../assets/baotou.jpg">
		<h2>404 Not Found</h2>
		<span></span>
		<div>
			<p>你所寻找的Loli<span class="red">不存在</span>！！</p>
			<p>可能该Loli已被<span class="red">推倒</span>！！</p>
			<p>或者是被怪蜀黍<span class="red">诱拐</span>！！</p>
			<p>亦或是被Loli控<span class="red">吃掉</span>！！</p>
		</div>
	</div>
	<div class="err-main panel" v-else-if="status === '500'">
		<img src="../assets/Home-Server-icon.png">
		<h2>500 Internal Server Error</h2>
		<span></span>
		<div>
			<p>服务器要<span class="red">爆炸啦！！</span>，快叫博主起床改BUG啊</p>
		</div>
	</div>
	<div class="err-main large-padding round panel" v-else>
		<img src="../assets/error-other.png">
		<h2>其它错误: {{status}}</h2>
		<span></span>
		<div>
			<p>作者没有为这个错误编写页面</p>
		</div>
	</div>
</main>
</template>

<script>
import {FullScreen} from "../mixins";

export default {
	name: "Error",
	mixins: [FullScreen],
	computed: {
		status() {
			return this.$route.params["code"];
		},
	},
};
</script>

<style scoped lang="less">
#error-container {
	display: grid;
	justify-content: center;
	align-items: center;
}

.err-main {
	min-width: 550px;
	display: grid;
	grid-template-columns: 8rem auto;
	grid-template-rows: 5rem 2rem auto;
	grid-gap: 1rem;
	justify-self: center;

	padding: 3rem; //.large-padding
	border-radius: 1rem; //.round
}

span.red {
	color: #f40000;
}
</style>
