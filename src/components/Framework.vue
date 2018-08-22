<template>
	<div id="app">
		<top-nav v-if="showNav"
				 :background="background"
				 :banner="banner"
				 :background-attach="backgroundAttach">
		</top-nav>
		<slot></slot>
		<page-footer v-if="showFooter"></page-footer>
	</div>
</template>

<script>
export default {
	name: "Framework",
	props: {
		background: {},
		banner: {},
		backgroundAttach:{},
		showNav: {
			type: Boolean,
			default: true,
		},
		showFooter: {
			type: Boolean,
			default: true,
		},
	},
};
</script>
