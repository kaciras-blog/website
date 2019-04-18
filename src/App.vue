<!-- 很多组件必须跟主实例中挂载，否则功能将受限 -->
<template functional>
	<div id="app">
		<router-view/>
		<kx-dialog-container/>
	</div>
</template>
