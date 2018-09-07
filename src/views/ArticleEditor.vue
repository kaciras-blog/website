<template>
	<kx-markdown-editor></kx-markdown-editor>
</template>

<script>
import {FullScreen} from "../mixins";

export default {
	name: "ArticleEditor",
	mixins: [FullScreen],
	created() {
		this.$emit("layoutChanged", {show: false}, false);
	},
};
</script>
