import { computed, defineComponent, useSSRContext } from "vue";

export default defineComponent({
	props: {
		title: String,
	},
	setup(props) {
		const full = computed(() => props.title + " - Kaciras Blog");

		if (import.meta.env.SSR) {
			const ssrContext = useSSRContext()!;
			return () => { ssrContext.title = full.value; };
		} else {
			return () => { document.title = full.value; };
		}
	},
});
