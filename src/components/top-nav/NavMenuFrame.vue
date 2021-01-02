<template>
	<transition
		:enter-class="$style.enter_before"
		:enter-active-class="$style.active_enter"
		:leave-to-class="$style.enter_before"
		:leave-active-class="$style.active_leave"
		@after-leave="afterLeave"
	>
		<!-- A11y: div 弹出层默认被辅助工具忽略，且组件内没有其他的关闭按钮，必须设置 role 和 title 属性来提示 -->
		<div
			v-show="visible"
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
import { PreventScrollMixin, PromiseSource } from "@kaciras-blog/uikit";
import NavMenu from "./NavMenu";

export default {
	name: "NavMenuFrame",
	mixins: [
		PreventScrollMixin,
	],
	isolation: true,
	components: {
		NavMenu,
	},
	data: () => ({
		visible: true,
	}),
	methods: {
		afterLeave() {
			this.transitionPromise.resolve();
		},
	},
	beforeDialogClose() {
		this.visible = false;
		return this.transitionPromise = new PromiseSource();
	}
};
</script>

<style module lang="less">
.container {
	composes: full-vertex from global;

	position: fixed;
	z-index: 800;
	background: rgba(0, 0, 0, .5);
}

.navMenu {
	max-width: 400px;
	width: 68vw;
	height: 100vh;
	will-change: transform;
}

.enter_before > .navMenu {
	transform: translateX(-100%);
}

.active_enter, .active_enter > .navMenu {
	transition: .3s;
}

.active_leave, .active_leave > .navMenu {
	transition: .3s linear;
}
</style>
