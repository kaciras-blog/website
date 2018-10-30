<template>
	<nav class="content">
		<div></div>
		<router-link
			class="logo-kaciras"
			to="/welcome"
			title="LOGO，点击回到首页"/>
		<div class="button" @click="showMenu=true"><i class="fas fa-bars"></i></div>
	</nav>
</template>

<script>
export default {
	name: "TopNavCollapsed",
};
</script>
