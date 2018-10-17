<template>
	<div id="app" @contextmenu.prevent="contextMenu">
		<button type="button" @click="mainDialog">算一下幸运数字</button>
		<kx-dialog-container></kx-dialog-container>
	</div>
</template>

<script>
export default {
	name: "app",
	methods: {
		mainDialog () {
			this.$dialog.show("lucky-number");
		},
		/**
		 *
		 * @param event {MouseEvent}
		 */
		contextMenu (event) {
			if (event.button !== 2) {
				return;
			}
			this.$dialog.show("KxContextMenu", {event});
		},
	},
};
</script>

<style lang="less">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

body {
	margin: 0;
	display: grid;
	grid-template-rows: auto 18rem auto;
	grid-template-columns: repeat(3, 1fr);
	grid-template-areas: "logo title title" "usage demo demo";
}

button {
	font-size: 1rem;
	margin-left: .5rem;
	margin-right: .5rem;
	background-color: white;
	padding: .4rem .8rem;
	border: solid 1px #80d1ff;
	border-radius: .4rem;
	color: #105497;
	cursor: pointer;
	min-width: 6rem;

	&:hover {
		background-color: #f7fcff;
		border-color: #00a5ff;
	}
}
</style>
