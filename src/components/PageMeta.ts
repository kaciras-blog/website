import type { SSRContext } from "vue/server-renderer";
import { defineComponent, useSSRContext } from "vue";

export interface PageMetaProps {
	title?: string;
	bodyClass?: string;
}

function renderServer(this: PageMetaProps, context: SSRContext) {
	const { title, bodyClass } = this;
	context.bodyClass = bodyClass;
	if (title) {
		context.title = title + " - Kaciras Blog";
	}
}

function renderClient(this: PageMetaProps) {
	const { title, bodyClass } = this;
	if (bodyClass !== undefined) {
		document.body.className = bodyClass;
	}
	if (title) {
		document.title = title + " - Kaciras Blog";
	}
}

export default defineComponent({
	props: {
		title: { type: String, required: false },
		bodyClass: { type: String, required: false },
	},
	setup(props) {
		if (import.meta.env.SSR) {
			const ssr = useSSRContext()!;
			return renderServer.bind(props, ssr);
		} else {
			return renderClient.bind(props);
		}
	},
});
