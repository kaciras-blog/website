declare module "@iktakahiro/markdown-it-katex" {
	import MarkdownIt from "markdown-it";
	const plugin: (md: MarkdownIt, ...params: any[]) => void;
	export default plugin;
}
