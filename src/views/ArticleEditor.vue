<template>
	<kx-markdown-editor/>
</template>

<script>
import {FullScreen} from "../mixins";

export default {
	name: "ArticleEditor",
	mixins: [FullScreen],
	created() {
		this.$emit("layout-changed", {show: false}, false);
	},
};
</script>
