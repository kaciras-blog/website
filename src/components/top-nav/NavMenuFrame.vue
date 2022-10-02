<template>
	<transition
		:enter-from-class='$style.enter_before'
		:enter-active-class='$style.active_enter'
		:leave-to-class='$style.enter_before'
		:leave-active-class='$style.active_leave'
		@after-leave='afterLeave'
	>
		<!--
			A11y: div 弹出层默认被辅助工具忽略，且组件内没有其他的关闭按钮，
			必须设置 role 和 title 属性来提示
		-->
		<div
			v-show='visible'
			:class='$style.container'
			role='button'
			title='点击或按 ESC 关闭弹窗'
			tabindex='0'
			v-autofocus
			@keydown.esc.self='$dialog.close'
			@click.self='$dialog.close'
		>
			<NavMenu :class='$style.navMenu'/>
		</div>
	</transition>
</template>

<script lang="ts">
export default {
	isolation: true,
};
</script>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PromiseSource, usePreventScroll } from "@kaciras-blog/uikit";
import NavMenu from "./NavMenu.vue";

usePreventScroll();

const visible = ref(false);
let transitionPromise: PromiseSource<void>;

function afterLeave() {
	transitionPromise.resolve();
}

function beforeDialogClose() {
	visible.value = false;
	return transitionPromise = new PromiseSource();
}

/**
 * Vue3 不能由外部的 v-if 触发根节点的过渡，所以要这样。
 */
onMounted(() => visible.value = true);

defineExpose({ beforeDialogClose });
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
