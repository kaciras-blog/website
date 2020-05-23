<template>
	<transition
		:enter-class="$style.enter_before"
		:enter-active-class="$style.active_enter"
		:leave-to-class="$style.enter_before"
		:leave-active-class="$style.active_leave"
	>
		<!-- A11y: div弹出层默认被辅助工具忽略，且组件内没有其他的关闭按钮，必须设置role和title属性来提示 -->
		<div
			v-show="show"
			:class="$style.container"
			role="button"
			title="点击或按ESC关闭弹窗"
			tabindex="0"
			v-autofocus="show"
			@keydown.esc.self="$emit('change', false)"
			@click.self="$emit('change', false)"
		>
			<nav-menu :class="$style.navMenu"/>
		</div>
	</transition>
</template>

<script>
import { preventScroll } from "@kaciras-blog/uikit";
import NavMenu from "./NavMenu";

export default {
	name: "NavMenuFrame",
	components: {
		NavMenu,
	},
	model: {
		prop: "show",
		event: "change",
	},
	props: {
		show: Boolean,
	},
	watch: {
		show(value, oldValue) {
			if (value === oldValue) {
				return;
			}
			this.$_scroll = value ? preventScroll() : this.$_scroll();
		},
	},
	// 处理因外层组件销毁导致没还原滚动的问题
	mounted() {
		if(this.show) {
			this.$_scroll = preventScroll();
		}
	},
	destroyed() {
		this.$_scroll && this.$_scroll();
	},
};
</script>

<style module lang="less">
.container {
	composes: full-vertex from global;

	position: fixed;
	z-index: 1000;
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
