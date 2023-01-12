// TreeShaking 优化，排除掉不需要的语言
import hljs from "highlight.js/lib/core";
import MarkdownIt from "markdown-it";

import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import xml from "highlight.js/lib/languages/xml";
import cs from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import http from "highlight.js/lib/languages/http";
import ini from "highlight.js/lib/languages/ini";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import less from "highlight.js/lib/languages/less";
import lua from "highlight.js/lib/languages/lua";
import protobuf from "highlight.js/lib/languages/protobuf";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import scss from "highlight.js/lib/languages/scss";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import yaml from "highlight.js/lib/languages/yaml";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("cs", cs);
hljs.registerLanguage("css", css);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("go", go);
hljs.registerLanguage("http", http);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("less", less);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("protobuf", protobuf);
hljs.registerLanguage("python", python);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("typescript", typescript);

/**
 * 自定义代码块的插件，因为 MarkdownIt 自带的渲染函数要求最外层是 pre，限制了扩展性，
 * 所以本项目整个替换它而不是使用 highlight 选项。
 *
 * # 标签的选择
 * [HTML 标准文档](https://html.spec.whatwg.org/#the-code-element)中的第二个
 * 示例使用了 pre 和 code 两个标签包裹代码块，这被许多人视为推荐的做法。
 *
 * 但实际上文档中本没有 Recommend 或 Should 等字眼，它仅是一个示例而已。
 * [这里也有讨论](https://stackoverflow.com/q/11742907/7065321)
 *
 * 本站为了性能和调试，会尽量减少 DOM 中元素的层级，所以选择在代码外仅用一个标签。
 * 考虑到存在非代码，但又要格式化的文本，选择 pre 更通用，GitHub 也是如此。
 */
export default function hljsPlugin(markdownIt: MarkdownIt) {
	const { unescapeAll, escapeHtml } = markdownIt.utils;

	markdownIt.renderer.rules.fence = (tokens, idx) => {
		const { content, info } = tokens[idx];
		let language = "";

		if (info) {
			[language] = unescapeAll(info).trim().split(/(\s+)/g);
		}

		const result = hljs.getLanguage(language)
			? hljs.highlight(content, { language }).value
			: escapeHtml(content);

		return `<pre class='hljs'>${result}</pre>`;
	};
}
