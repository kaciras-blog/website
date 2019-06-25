<template>
	<transition
		:enter-class="$style.enter_before"
		:enter-active-class="$style.active_enter"
		:leave-to-class="$style.enter_before"
		:leave-active-class="$style.active_leave"
	>
		<!-- A11y: div弹出层默认被辅助工具忽略，且组件内没有其他的关闭按钮，必须设置role和title属性来提示 -->
		<div
			v-show="hackShow"
			:class="$style.container"
			role="button"
			title="点击或按ESC关闭弹窗"
			tabindex="0"
			v-autofocus
			@keydown.esc.self="$dialog.close"
			@click.self="$dialog.close"
		>
			<nav-menu :class="$style.navMenu"/>
		</div>
	</transition>
</template>

<script>
import NavMenu from "./NavMenu";
import { PreventScrollMixin } from "kx-ui";

export default {
	name: "NavMenuFrame",
	components: {
		NavMenu,
	},
	mixins: [
		PreventScrollMixin,
	],
	/**
	 * Vue 的过渡组件要求必须在过渡前渲染，也就是说必须是 transition 内部组件的 v-if 等才能生效。
	 * 这里HACK一下，先不显示组件，在插入后的下一帧里再显示，以触发 transition 的过渡功能。
	 */
	data: () => ({
		hackShow: false,
	}),
	mounted() {
		this.hackShow = true;
	},
};
</script>

<style module lang="less">
.container {
	composes: full-vertex from global;
	position: fixed;
	z-index: 1000;
	background: rgba(0, 0, 0, .4);
}

.navMenu {
	max-width: 400px;
	width: 68vw;
	height: 100vh;
}

.enter_before {
	background: rgba(0, 0, 0, 0);

	& > .navMenu {
		transform: translateX(-100%);
	}
}

.active_enter, .active_enter > .navMenu {
	transition: all ease-in .2s;
}

.active_leave, .active_leave > .navMenu {
	transition: all linear .2s;
}
</style>
