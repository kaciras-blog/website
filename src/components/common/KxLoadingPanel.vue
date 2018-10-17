<script>
import SkFadingCircle from "./SkFadingCircle";

export default {
	name: "KxLoadingPanel",
	props: {
		loader: {
			type: Function,
			required: true,
		},
	},
	data: () => ({
		loaded: null,
	}),
	render (h) {
		if(!this.loaded)
			return h(SkFadingCircle);
		return h(this.$slots.default[0], { props: this.loaded });
	},
	beforeMount () {
		this.loader().then(() => this.loading = false);
	},
};
</script>

<style scoped>

</style>
