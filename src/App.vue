<!-- 很多组件必须跟主实例中挂载，否则功能将受限 -->
<template>
	<div id="app">
		<router-view/>
		<popup-alert-container/>
		<kx-dialog-container/>
	</div>
</template>
