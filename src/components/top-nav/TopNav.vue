<template functional>
	<top-nav-body
		tag="nav"
		v-bind="data.attrs"
		:class="[data.class, data.staticClass]"
		:style="[data.style, data.staticStyle]"
		v-on="listeners"
	/>
</template>

<script>
export default { name: "TopNav" };
</script>
