<template>
	<div>
		<div class="global-dimmer" v-if="showMenu" @click="showMenu=false"></div>
		<div class="menu" v-if="showMenu">
			<div>

			</div>
			<div class="links">
				<router-link class="block fold" to="/welcome">欢迎页</router-link>
				<router-link class="block" to="/login" v-if="!user">登录</router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TopNavMenu",
};
</script>

<style scoped>

</style>
