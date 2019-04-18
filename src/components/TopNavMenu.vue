<template>
	<transition
		:enter-class="$style.transStart"
		:leave-to-class="$style.transStart"
		:enter-active-class="$style.active"
		:leave-active-class="$style.active">

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
};
</script>

<style module lang="less">
.transStart {
	transform: translateX(-75vw);
}

.active {
	transition: all linear .25s;
}

.container {
	display: block;
}

.navMenu {
	width: 75vw;
	height: 100vh;
}
</style>
