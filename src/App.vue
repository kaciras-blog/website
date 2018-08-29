<template>
<div id="app">
	<top-nav v-if="topNav.show" v-bind="topNav"></top-nav>
	<router-view @layoutChanged="configLayout"></router-view>
	<page-footer v-if="showFooter"></page-footer>
	<kx-dialog-container></kx-dialog-container>
</div>
</template>

<script>
export default {
	data() {
		return {
			topNav: {
				show: true,
				clazz: null,
				banner: true,
			},
			showFooter: true,
		};
	},
	methods:{
		configLayout(nav, showFooter) {
			if(typeof nav === "function") {
				nav = nav();
			}
			Object.assign(this.topNav, nav);
			this.showFooter = showFooter;
		},
	},
	watch: {
		'$route'() { //当视图切换时重置布局
			this.showFooter = true;
			this.topNav.clazz = null;
			this.topNav.banner = true;
		},
	},
};
</script>
