/*
 * 判断浏览器是否支持运行本应用，根据以下标准：
 *
 * 1.以 ES2020 的 Nullish coalescing operator 为基准。
 * 2.一些垃圾比如 IPadQQ 内置的浏览器不支持 IntersectionObserver。
 *
 * SyntaxError thrown thrown while the code is being parsed,
 * to catch it the code must be wrapped by eval() and the script block
 * must be run before parsing the invalid code.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
	__isSupport__: boolean;
}

try {
	// noinspection JSUnusedLocalSymbols
	eval("const x = null ?? 0");

	window.__isSupport__ = "IntersectionObserver" in window;
} catch {
	window.__isSupport__ = false;
}

if (!window.__isSupport__) {
	window.alert("您的浏览器版本太旧，或是非主流内核，可能无法正常浏览本站，\n" +
		"请使用最新版的 Edge、Firefox、Chrome、Safari 等浏览器。");
}
