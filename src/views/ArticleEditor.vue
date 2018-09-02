<template>
	<kx-markdown></kx-markdown>
</template>

<script>
import KxMarkdown from "../markdown/KxMarkdown";
import {FullScreen} from "../mixins";

export default {
	name: "ArticleEditor",
	components: {KxMarkdown},
	mixins: [FullScreen],
	created() {
		this.$emit("layoutChanged", {show: false}, false);
	},
};
</script>
