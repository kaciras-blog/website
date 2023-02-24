/*
 * 判断浏览器是否支持运行本应用，根据以下标准：
 *
 * 1.以 ES2020 的 Nullish coalescing operator 为基准。
 * 2.难以检测 :is() 选择器，换 aspect-ratio 属性代替（在 Chrome 和 Edge 的支持与 :is 相同）
 * 3.顶部的导航栏使用了 backdrop-filter，若不支持则很难看。
 *
 * 【为什么单独一个文件】
 * SyntaxError thrown while the code is being parsed,
 * to catch it the code must be wrapped by eval() and the script block
 * must be run before parsing the invalid code.
 *
 * 【为什么放在 public 里】
 * Vite 会将 <script> 引用的文件合并成一个，但本文件需要在主脚本加载之前执行，
 * 所以只能复制到构建结果中了，还好代码不多无需打包。
 */

try {
	// noinspection JSUnusedLocalSymbols
	eval("let x = null; x ??= 1");

	window.__SUPPORTED__ =
		CSS.supports("aspect-ratio", "1") &&
		CSS.supports("backdrop-filter", "blur()");
} catch {
	window.__SUPPORTED__ = false;
}

if (!window.__SUPPORTED__) {
	window.alert("您的浏览器版本太旧，或是非主流内核，可能无法正常浏览本站，\n" +
		"请使用最新版的 Edge、Firefox、Chrome、Safari 等浏览器。");
}
