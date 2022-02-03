<template>
	<kx-base-dialog title="设置" :class="$style.dialog">
		<setting-panel/>
		<kx-dialog-buttons :on-accept="$dialog.close"/>
	</kx-base-dialog>
</template>

<style module>
.dialog { width: 30rem; }
</style>
