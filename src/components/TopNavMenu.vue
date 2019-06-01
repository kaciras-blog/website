<template>
	<transition
		:enter-class="$style.transStart"
		:leave-to-class="$style.transStart"
		:enter-active-class="$style.active"
		:leave-active-class="$style.active"
		@after-enter="afterEnter"
		@before-leave="beforeLeave"
	>
		<!-- div弹出层默认被辅助工具忽略，且组件内没有其他的关闭按钮，必须设置role和title属性来提示 -->
		<kx-modal-wrapper
			:class="$style.container"
			:prevent-scroll="true"
			role="button"
			title="点击或按ESC关闭弹窗"
			tabindex="0"
			v-autofocus
			@keydown.esc.self.native="$dialog.close"
			@click.self.native="$dialog.close"
		>
			<personal-view :class="$style.navMenu"/>
		</kx-modal-wrapper>
	</transition>
</template>

<script>
import PersonalView from "./PersonalView";
import KxModalWrapper from "kx-ui/src/dialog/KxModalWrapper";

export default {
	name: "TopNavMenu",
	components: { KxModalWrapper, PersonalView },
	methods: {
		afterEnter(el) {
			el.style.background = "rgba(0, 0, 0, .4)";
		},
		beforeLeave(el) {
			el.style = undefined;
		},
	},
};
</script>

<style module lang="less">
// 由于本站主体部分大量使用图片，故侧栏不宜再搞图片背景，不然显得太乱

.transStart {
	transform: translateX(-100%);
}

.active {
	transition: transform linear .2s;
}

.container {
	display: block;
	background: none;
}

.navMenu {
	position: relative;
	max-width: 400px;
	width: 70vw;
	height: 100vh;
}
</style>
