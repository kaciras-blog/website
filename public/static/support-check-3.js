/*
 * 判断浏览器是否支持运行本应用，根据以下标准：
 * 1.以 ES2022 的 [].at() 为基准。
 * 2.顶部的导航栏使用了 backdrop-filter，若不支持则很难看。
 *
 * 【为什么单独一个文件】
 * 如果打包在一起，主模块引用的三方库一旦出现不支持的语法，则在解析节点就会出错，
 * 从而导致此处的代码无法运行，显示不了提示。
 *
 * 【为什么放在 public 里】
 * Vite 会将 <script> 引用的文件合并成一个，但本文件需要在主脚本加载之前执行，
 * 所以只能复制到构建结果中了，还好代码不多无需打包。
 */

try {
	eval("let x dasdsa");

	window.__SUPPORTED__ =
		CSS.supports("backdrop-filter", "blur()")
		&& "at" in Array.prototype;
} catch {
	window.__SUPPORTED__ = false;
}

if (!window.__SUPPORTED__) {
	window.alert("您的浏览器版本太旧，或是非主流内核，可能无法正常浏览本站，\n" +
		"请使用最新版的 Edge、Firefox、Chrome、Safari 等浏览器。");
}
