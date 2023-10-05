import { defineStore } from "pinia";
import api, { AuthType, User } from "@/api/index.ts";

const GUESTS: User = {
	id: 0,
	auth: AuthType.None,
	name: "(游客)",

	// TODO: Pinia 设计上分两层 reactive 存储，内层由 state 选项生成但是在绑定到最终结果时
	//  用了 toRefs 导致忽略了 undefined 和不存在的属性，使得 $patch 在给这样的属性赋值时不能触发响应。
	//  https://github.com/vuejs/pinia/blob/98d09b08f3d8ca3bb193a31a788cb5ed92f22396/packages/pinia/src/store.ts#L133
	avatar: null as any,
};

/** 当前登录的用户，其值将在入口处被设置 */
export const useCurrentUser = defineStore("user", {
	state: () => GUESTS,
	getters: {
		isAdmin: state => state.id === 2,
	},
	actions: {
		async refresh(apiUse = api) {
			const res = await apiUse.user.getCurrent();
			if (res.status < 300) {
				this.$patch(await res.json());
			}
		},
		logout() {
			return api.user.logout().then(() => this.$reset());
		},
	},
});

/** 路由页面的预取数据 */
export const usePrefetch = defineStore("prefetch", {
	state: () => ({ data: {} as any }),
});

/** 评论设置，因为不常变所以放到全局免得每次都读取 */
export const useDiscussOptions = defineStore("discussOptions", {
	state: () => ({ options: null }),
	actions: {
		async load() {
			this.options ??= await api.config.load("discussion");
		},
	},
});
