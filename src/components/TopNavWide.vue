<template>
	<div class="nav-right">

		<template v-if="user && user.id > 0">
			<router-link to="/profile">
				<img :src="user.head"
					 alt="用户头像"
					 title="就是一个头像而已"
					 class="small head"
					 :class="$style.head">
			</router-link>
			<router-link
				v-if="user.id === 2"
				to="/console"
				class="nav-item">
				管理
			</router-link>
			<button
				@click="logout"
				class="nav-item">
				退出登录
			</button>
		</template>

		<router-link
			v-else
			to="/login"
			class="nav-item">
			登录
		</router-link>

		<router-link to="/about" class="nav-item">关于</router-link>
	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { REMOVE_USER } from "../store/types";

export default {
	name: "TopNavWide",
	computed: {
		...mapState(["user"]),
	},
	methods: {
		...mapActions({ logout: REMOVE_USER }),
	},
};
</script>

<style module lang="less">
.container {
	margin-left: auto;
}
.head {
	vertical-align: top;
	margin: 0 10px;
}
</style>
