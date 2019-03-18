<template>
	<div :class="{ [activeClass]: value === name }" @click="$emit('input', name)"><slot/></div>
</template>

<script>
export default {
	name: "TabButton",
	props: {
		name: {
			type: String,
			required: true,
		},
		value: String,
		activeClass: String,
	},
};
</script>
