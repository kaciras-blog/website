import { defineStore } from "pinia";
import api, { AuthType, User } from "@/api";
import { SunPhases } from "@/sun-phase";

/**
 * 定义几个太阳位置：7-11 黎明，11-16 白天, 16 - 20 黄昏，20 - 7 夜晚。
 *
 * 这些时间并不通用，因为昼夜的长短还与纬度有关。应当通过太阳角度公式来计算，但是在浏览器里获取
 * 用户的位置信息并不方便，使用 navigator.geolocation 需要授权，为了这个功能去请求权限不划算。
 */
export const SUN_PHASES = new SunPhases({
	Dawn: 7,
	Daytime: 11,
	Dusk: 16,
	Night: 20,
});

const GUESTS: User = {
	id: 0,
	name: "(游客)",
	auth: AuthType.None,
};

/** 当前登录的用户，其值将在入口处被设置 */
export const useCurrentUser = defineStore("user", {
	state: () => GUESTS,
	actions: {
		async refresh(apiUse = api) {
			const res = await apiUse.user.getCurrent();
			if (res.status < 300) {
				this.$state = res.data;
			}
		},
		logout() {
			return api.user.logout().then(() => this.$state = GUESTS);
		},
	},
});

/** 路由页面的预取数据 */
export const usePrefetch = defineStore("prefetch", {
	state: () => ({} as any),
});

/**
 * 当前的太阳阶段，值是上面 SUN_PHASES 的字段名，null 表明无法确定。
 * 【注意】不要使用 undefined，$store.watch 无法监听值为 undefined 的字段。
 */
export const useSunPhase = defineStore("sunPhase", {
	state: () => ({
		current: null as unknown as string,
	}),
	actions: {
		toNext() {
			this.current = SUN_PHASES.nextOf(this.current);
		},
	},
});

/** 评论设置，因为不常变所以放到全局免得每次都读取 */
export const useDiscussOptions = defineStore("discussOptions", {
	state: () => ({ options: null }),
	actions: {
		async load() {
			this.$state ??= await api.config.get("discussion");
		},
	},
});
