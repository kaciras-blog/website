<template>
	<nav :class='[$style.container, colored && $style.colored]'>
		<RouterLink
			to='/'
			title='回到首页'
			:class='$style.logoLink'
		>
			<img
				src='@/assets/img/logo-kaciras-wide.png'
				alt='logo'
				:class='$style.logo'
			>
		</RouterLink>

		<!-- 手机屏的折叠菜单 -->
		<button
			v-if='$bp.value === "mobile"'
			title='弹出菜单'
			class='nav-item'
			@click='showMenu'
		>
			<ListIcon/>
		</button>

		<!-- 宽屏直接把按钮都显示在上面 -->
		<template v-else>
			<template v-if='user.id > 0'>
				<RouterLink to='/profile'>
					<img
						:src='user.avatar'
						:alt='user.name'
						title='就是一个头像而已'
						:class='$style.head'
					>
				</RouterLink>
				<RouterLink
					v-if='user.isAdmin'
					to='/console'
					class='nav-item'
				>
					管理
				</RouterLink>
				<button
					class='nav-item'
					@click='logout'
				>
					退出登录
				</button>
			</template>

			<RouterLink v-else to='/login' class='nav-item'>
				登录
			</RouterLink>
			<RouterLink to='/list' class='nav-item'>
				文章
			</RouterLink>
			<RouterLink to='/about/me' class='nav-item'>
				关于
			</RouterLink>
			<a href='/feed/atom' class='nav-item' title='Feed订阅'>
				<RssIcon/>
			</a>
			<button class='nav-item' title='设置' @click='showSettings'>
				<SettingIcon/>
			</button>
		</template>
	</nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBreakPoint, useDialog } from "@kaciras-blog/uikit";
import { useEventListener } from "@vueuse/core";
import ListIcon from "bootstrap-icons/icons/list.svg?sfc";
import SettingIcon from "@material-design-icons/svg/filled/settings.svg?sfc";
import RssIcon from "@material-design-icons/svg/filled/rss_feed.svg?sfc";
import { useCurrentUser } from "@/store/index.ts";
import NavMenuFrame from "./NavMenuFrame.vue";
import SettingDialog from "./SettingDialog.vue";

const user = useCurrentUser();
const dialog = useDialog();
const breakPoint = useBreakPoint();

const colored = ref(false);

function logout() {
	return user.logout();
}

function showMenu() {
	dialog.show(NavMenuFrame);
}

function scrollFunction() {
	colored.value = document.body.scrollTop > 16 || document.documentElement.scrollTop > 16;
}

function showSettings() {
	dialog.show(SettingDialog);
}

if (breakPoint.value === "mobile") {
	useEventListener("scroll", scrollFunction);
}
</script>

<style module lang="less">
@import "../../css/imports.less";

.container {
	composes: top-nav from global;

	display: flex;
	background-color: rgba(255, 255, 255, .5);
	backdrop-filter: blur(4px);
	transition: background-color .3s;

	@media screen and (max-width: @length-screen-mobile) {
		position: sticky;
		top: 0;
	}

	@media screen and (min-width: @length-screen-pad) {
		padding: 0 ~"max(5vw, calc(50vw - var(--body-max) / 2))";
	}
}

:global(.dark).container {
	background-color: rgba(255, 255, 255, .1);
}

/* 外层套了个 <a> 所以宽高不能用百分比，只能写死图片的大小 */
.logo {
	display: block;
	aspect-ratio: 703 / 225;
	height: @nav-height;
}

.logoLink {
	margin-right: auto;
}

.head {
	composes: small head from global;

	margin: 0 10px;
	vertical-align: top;
}

.fontIcon {
	font-size: 20px;
	vertical-align: middle;

	/* 固定宽度防止字体加载后重排 */
	/* TODO: 下一版不用垃圾字体图标了 */
	width: 25px;
	text-align: center;
}

/* 懒得改了重构整个TopNav，先用 !important 凑合过吧 */
.colored {
	background-color: white !important;

	& :global(.nav-item) {
		color: black !important;
	}
}
</style>
