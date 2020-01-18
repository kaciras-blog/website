import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

test("image", () => {

	const converter = new MarkdownIt();
	const defaultImageRenderer = converter.renderer.rules.image;

	converter.renderer.rules.image = function (tokens, idx, options, env, self) {
		const token = tokens[idx];
		const srcValue = token.attrGet("src");
		token.attrPush(["data-src", srcValue]);
		// token.attrSet("src", pluginOptions.placeholder);

		const wrapper = `<a href="${token.attrGet("src")}" class="image-wrapper">`;
		return wrapper + defaultImageRenderer(tokens, idx, options, env, self) + "</a>";
	};

	const html = converter.render("![alternative text](/image/abc.png)");
	expect(html).toBe("sad");
});
