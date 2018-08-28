<template>
	<div>
		<top-nav v-if="showNav"
				 :optionalClass="optionalClass"
				 :banner="banner">
		</top-nav>
		<slot></slot>
		<page-footer v-if="showFooter"></page-footer>
	</div>
</template>

<script>
export default {
	name: "Framework",
	props: {
		optionalClass: {},
		banner: {},
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
