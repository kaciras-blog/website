<template>
	<transition
		:enter-class="$style.transStart"
		:leave-to-class="$style.transStart"
		:enter-active-class="$style.active"
		:leave-active-class="$style.active"
		@after-enter="afterEnter"
		@before-leave="beforeLeave">

		<kx-modal-wrapper
			:prevent-scroll="true"
			@click.self.native="$dialog.close"
			:class="$style.container">

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
.transStart {
	transform: translateX(-100%);
}

.active {
	transition: transform linear .25s;
}

.container {
	display: block;
	background: none;
}

.navMenu {
	max-width: 400px;
	width: 75vw;
	height: 100vh;
}
</style>
